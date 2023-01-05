/** @type {import('@/types/BoostConfiguration').BoostConfiguration} */
module.exports.default = {
    id: 'fix-readme-badges',
    version: '1.0.0',
    repository_limits: {
        max_runs_per_version: 1,
        minutes_between_runs: 60,
    },
    pull_request: {
        title: 'Fix Readme badges',
        body: 'pull-request-body.edge.md',
        branch: 'fix-readme-badges',
    },
    scripts: {
        parallel: true,
        files: [ 'fix-readme-badge.js' ],
    },
};
