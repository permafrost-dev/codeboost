module.exports.default = {
    github_token: '$CODEBOOST_GITHUB_TOKEN',
    repository_storage_path: `${__dirname}/dist/storage/repositories`,
    boosts_path: `${__dirname}/examples`,
    use_forks: false,
    use_pull_requests: false,
    log_target: [ 'console', 'file' ],
};
