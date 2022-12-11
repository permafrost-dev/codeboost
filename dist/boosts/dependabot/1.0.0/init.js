/** @type {import('@/lib/Boost').BoostScriptHandler} */
module.exports.handler = async function (params) {
    params.boost.log('initializing boost...');
    //
    params.boost.log('finished initializing boost');
};
