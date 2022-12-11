module.exports.default = {
    id: 'test-one',
    version: '1.0.0',
    repository_limits: {
        max_runs_per_version: 1,
        minutes_between_runs: 60,
    },
    pull_request: {
        title: 'Add Test One',
        body: 'This PR is a test',
        branch: 'add-test-one',
    },
    scripts: {
        parallel: true,
        files: ['a.js', 'b.js'],
    },
    actions: [{ name: 'update-file', file: { src: 'composer.json', dest: 'composer.json' } }],
};
