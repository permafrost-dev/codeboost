module.exports.default = {
    github_token: '$CODEBOOST_GITHUB_TOKEN',
    repository_storage_path: `${__dirname}/dist/storage/repositories`,
    boosts_path: `${__dirname}/dist/boosts`,
    use_forks: true,
    use_pull_requests: true,
    log_target: [ 'console', 'file' ],
};
