/** @type {import('@/lib/Boost').BoostScriptHandler} */
module.exports.handler = async function ({ boost, repository }) {
    console.log(`a script ran by ${boost.id} v${boost.version} on ${repository.owner}/${repository.name}`);

    //const random = Math.floor(Math.random() * 2) + 1;
    //await new Promise((resolve) => setTimeout(resolve, random * 1000));

    return true;
};
