/** @type {import('@/lib/Boost').BoostScriptHandler} */
module.exports.handler = async function ({
    args, boost, repository, git, libs, tools 
}) {
    boost.state.updatedWorkflow = false;

    const phpVersionToAdd = args[0];

    let filename = repository.path + '/.github/workflows/run-tests.yml';

    if (typeof boost.state.testWorkflowFile === 'string' && boost.state.testWorkflowFile.length > 0) {
        filename = boost.state.testWorkflowFile;
    }

    boost.log('checking workflow: ' + libs.path.basename(filename));

    const data = tools.readYaml(filename);
    const firstJobName = Object.keys(data.jobs)[0] || 'test';
    const matrix = data.jobs[firstJobName].strategy.matrix;

    matrix.php = matrix.php.map(v => `${v}`).map(v => (v.length === 1 ? `${v}.0` : `${v}`));

    if (matrix.php.includes(phpVersionToAdd)) {
        boost.log('stopping, PHP 8.2 is already in the matrix');
        return true;
    }

    matrix.php.push(phpVersionToAdd);
    matrix.php.sort().reverse();
    matrix.php = [ ...new Set(matrix.php) ];

    boost.log(`Added PHP ${phpVersionToAdd} to workflow matrix`);

    let fileContent = tools.readfile(filename).replace(/php:\s*\[.+\]/, `php: [${matrix.php.join(', ')}]`);

    if (!boost.state.updatedComposerJson) {
        if (fileContent.includes('"laravel/framework:${{ matrix.laravel }}"')) {
            fileContent = fileContent.replace(
                '"laravel/framework:${{ matrix.laravel }}"',
                '"laravel/framework:${{ matrix.laravel }}" "nesbot/carbon:^2.63"',
            );
            boost.log('Required "nesbot/carbon:^2.63" in workflow');
        }
    }

    tools.writefile(filename, fileContent);
    boost.changedFiles.push(filename);

    await git.add(filename);
    await git.commit(`added php ${phpVersionToAdd} support to workflow`);

    boost.state.updatedWorkflow = true;

    return true;
};
