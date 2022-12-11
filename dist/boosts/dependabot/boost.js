/** @type {import('@/types/BoostConfiguration').BoostConfiguration} */
module.exports.default = {
    id: 'dependabot',
    version: '1.0.0',
    repository_limits: {
        max_runs_per_version: 1,
        minutes_between_runs: 60,
    },
    pull_request: {
        title: 'Add Dependabot Support',
        body: 'pull-request-body.edge.md',
        branch: 'add-dependabot-support',
    },
    scripts: {
        parallel: true,
        files: ['copy-files-to-repo.js'],
    },
    actions: [],
};
