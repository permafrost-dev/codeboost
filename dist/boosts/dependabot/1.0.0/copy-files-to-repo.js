const fs = require('fs');

const recursiveDirectoryCopy = async (boost, repository, tools, src, dest, destFiles) => {
    const files = fs.readdirSync(src);

    files
        .filter(file => file !== '.' && file !== '..')
        .forEach(file => {
            const srcFn = src + '/' + file;
            const destFn = dest + '/' + file;

            const stats = fs.lstatSync(srcFn, { throwIfNoEntry: false }) || null;

            if (stats === null) {
                return;
            }

            if (stats?.isFile()) {
                if (!tools.filesAreEqual(srcFn, destFn)) {
                    fs.copyFileSync(srcFn, destFn);
                    destFiles.push(destFn);
                    boost.log('copied file: ' + destFn.replace(repository.path, '.'));
                }
            }

            if (stats?.isDirectory()) {
                if (!fs.existsSync(destFn)) {
                    fs.mkdirSync(destFn);
                }
                recursiveDirectoryCopy(boost, repository, tools, srcFn, destFn, destFiles);
            }
        });

    return destFiles;
};

/** @type {import('@/lib/Boost').BoostScriptHandler} */
module.exports.handler = async function ({ boost, git, libs, repository, tools }) {
    boost.log('copying files to repository...');

    const newfiles = [];
    const filelist = await recursiveDirectoryCopy(boost, repository, tools, boost.path + '/files', repository.path, newfiles);

    boost.log('finished, total files copied: ' + filelist.length);

    if (filelist.length) {
        await git.add(filelist);
        await git.commit('add dependabot support');

        boost.log('committed changes to git');
    }

    return true;
};
