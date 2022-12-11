/** @type {import('@/lib/Boost').BoostScriptHandler} */
module.exports.handler = async function ({ boost, repository, git }) {
    console.log(`b script ran by ${boost.id} v${boost.version} on ${repository.owner}/${repository.name}`);

    console.log('branches: ', await git.getRemotes());

    return true;
};
