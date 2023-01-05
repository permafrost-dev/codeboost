/** @type {import('@/lib/Boost').BoostScriptHandler} */
module.exports.handler = async function ({
    boost, repository, git, libs, tools 
}) {
    let filename = repository.path + '/README.md';

    if (!libs.fs.existsSync(filename)) {
        boost.log('stopping, no readme found');
        return true;
    }

    boost.log('checking readme: ' + libs.path.basename(filename));

    let fileContent = tools.readfile(filename);

    if (!fileContent.includes('img.shields.io/github/workflow/status/')) {
        boost.log('stopping, no broken workflow badge found');
        return true;
    }

    const workflowNameMatches = fileContent.match(/img\.shields\.io\/github\/workflow\/status\/[^/]+\/[^/]+\/([^?]+)/);

    if (!workflowNameMatches) {
        boost.log('stopping, no workflow name found');
        return true;
    }

    fileContent = fileContent.replaceAll('img.shields.io/github/workflow/status/', 'img.shields.io/github/actions/workflow/status/');
    fileContent = fileContent.replaceAll(`/status/${workflowNameMatches[1]}`, `/status/${libs.path.basename(boost.state.testWorkflowFile)}`);

    boost.log(`Updated badge url`);

    tools.writefile(filename, fileContent);
    boost.changedFiles.push(filename);

    await git.add(filename);
    await git.commit(`fix readme badge`);

    return true;
};
