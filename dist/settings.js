module.exports.default = {
    github_token: '$CODEBOOST_GITHUB_TOKEN',
    repository_storage_path: `${__dirname}/storage/repositories`,
    use_forks: true,
    use_pull_requests: true,
    log_target: [ 'console', 'file' ],
};
