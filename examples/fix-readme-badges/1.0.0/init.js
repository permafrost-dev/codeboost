const findTestWorkflow = async function ({
    boost, git, libs, repository, tools 
}) {
    boost.log('finding tests workflow...');

    if (typeof boost.state.testWorkflowFile === 'string' && boost.state.testWorkflowFile.length > 0) {
        boost.log('found tests workflow');
        return boost.state.testWorkflowFile;
    }

    boost.state.testWorkflowFile = '';

    for (const file of libs.fs.readdirSync(repository.path + '/.github/workflows', { encoding: 'utf-8', withFileTypes: true })) {
        if (file.isDirectory()) {
            continue;
        }

        if (file.name.endsWith('.yml') || file.name.endsWith('.yaml')) {
            const data = tools.readfile(repository.path + '/.github/workflows/' + file.name);
            if (data.includes('test') && (data.includes('phpunit') || data.includes('pest'))) {
                boost.log('found tests workflow ' + file.name);
                boost.state.testWorkflowFile = repository.path + '/.github/workflows/' + file.name;
                return boost.state.testWorkflowFile;
            }
        }
    }

    boost.log('could not find tests workflow');
    return false;
};

/** @type {import('@/lib/Boost').BoostScriptHandler} */
module.exports.handler = async function (params) {
    params.boost.log('initializing boost...');

    params.boost.state.testWorkflowFile = '';

    await findTestWorkflow(params);

    params.boost.log('finished initializing boost');
};
