/** @type {import('@/lib/Boost').BoostScriptHandler} */
module.exports.handler = async function ({
    boost, git, libs, repository, tools 
}) {
    boost.log('checking composer.json for dependency: nesbot/carbon');

    const filename = repository.path + '/composer.json';
    const data = tools.readJson(filename);

    if (!Object.keys(data.require).includes('nesbot/carbon')) {
        boost.log('nesbot/carbon is not a dependency');
        boost.log('finished checking composer.json');
        return true;
    }

    boost.log('nesbot/carbon is a dependency');
    const currentVersion = libs.semver.coerce(data.require['nesbot/carbon']) ?? '0.0';
    const newVersion = '2.63';

    if (libs.semver.gte(currentVersion, libs.semver.coerce(newVersion) ?? '0.0')) {
        boost.log('nesbot/carbon is already up to date');
        return true;
    }

    data.require['nesbot/carbon'] = `^${newVersion}`;

    boost.log('bumped dependency version: nesbot/carbon to ^' + newVersion);

    tools.writeJson(filename, data);
    boost.changedFiles.push(filename);

    boost.log('updated composer.json dependency: nesbot/carbon');

    await git.add(filename);
    await git.commit('updated minimun version for nesbot/carbon dependency to 2.63');

    boost.log('committed changes to git');

    boost.state.updatedComposerJson = true;

    return true;
};
