/** @type {import('@/lib/Boost').BoostScriptHandler} */
module.exports.handler = async function ({
    boost, git, repository, tools 
}) {
    boost.log('copying files to repository...');

    const filelist = tools.recursiveDirectoryCopy(`${boost.path}/files`, repository.path, (src, dest) => {
        boost.log('copied file: ' + dest.replace(repository.path, '.'));
    });

    boost.log('finished, total files copied: ' + filelist.length);

    if (filelist.length) {
        await git.add(filelist);
        await git.commit('add dependabot support');

        boost.log('committed changes to git');
    }

    return true;
};
