/** @type {import('@/types/BoostConfiguration').BoostConfiguration} */
module.exports.default = {
    id: 'php-support',
    version: '1.0.0',
    repository_limits: {
        max_runs_per_version: 1,
        minutes_between_runs: 60,
    },
    pull_request: {
        title: 'Add PHP 8.2 Support',
        body: 'pull-request-body.edge.md',
        branch: 'add-php82-support',
    },
    scripts: {
        parallel: true,
        files: ['update-composer-json.js', 'update-tests-workflow.js'],
    },
    actions: [],
};
