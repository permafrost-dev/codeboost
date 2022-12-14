<p align="center">
    <img src="https://static-assets.permafrost.dev/images/projects/codeboost/logo.svg" width="100" height="100" alt="codeboost logo">
</p>

# codeboost

<p align="center">
    <img src="https://img.shields.io/github/actions/workflow/status/permafrost-dev/codeboost/run-tests.yml?style=flat-square&logo=github&label=tests" alt="Run Tests">
    <img src="https://img.shields.io/codecov/c/github/permafrost-dev/codeboost?color=%234c1&label=coverage&logo=codecov&logoColor=%23ef6f6f&style=flat-square&token=qYptYEWlm7" alt="codecov">
    <img src="https://img.shields.io/github/license/permafrost-dev/codeboost?style=flat-square&logo=opensourceinitiative&logoColor=white" alt="license">
    <br>
    <img src="https://img.shields.io/codeclimate/tech-debt/permafrost-dev/codeboost?label=tech%20debt&amp;logo=codeclimate&amp;style=flat-square&nocache=1" alt="techdebt">
    <img src="https://img.shields.io/scrutinizer/quality/g/permafrost-dev/codeboost/main?logo=scrutinizer&style=flat-square" alt="scrutinizer score" />
    <img src="https://api.codeclimate.com/v1/badges/688e30d604cdcd93a262/maintainability" alt="maintainability" />
    <!--br>
    <img src="https://shields.io/npm/v/codeboost?style=flat-square&logo=npm&logoColor=white" alt="npm version">
    <img src="https://img.shields.io/npm/dt/codeboost.svg?style=flat-square&logo=npm&logoColor=white" alt="npm downloads"-->
    <br><br>
    <img src="https://badgen.net/github/dependabot/permafrost-dev/codeboost?style=flat-square" alt="dependabot status">
    <img src="https://img.shields.io/depfu/dependencies/github/permafrost-dev/codeboost?style=flat-square&nocache=1" alt="Depfu">
    <!--img src="https://img.shields.io/npm/v/codeboost?label=npm%20version&logo=npm&logoColor=%23f1f5f9&style=flat-square" alt="version"-->
</p>

`codeboost` is a CLI tool and library that enables developers to automate common repository tasks such as updating dependencies, fixing linting errors, modifying READMEs, or adding new workflows.

Run these tasks across a single repository or multiple repositories at once with a single command.

## Quick Start

```bash
npm install -g codeboost

codeboost init
```

## Usage

You must initialize `codeboost` before you can run any boosts. You only need to run this command once to initialize the global configuration file:

```bash
codeboost init
```

Run a boost:

```bash
codeboost run --repo <repository> <boost-name>
```

Run a boost on a batch of repositories:

```bash
codeboost run --batch repositories.json --size 3 <boost-name>
```

When running in batch mode, the `--size` option can be used to specify the number of repositories to process at once. The default is 1.
The `--batch` option can be used to specify a JSON file containing an array of objects that have a `name` property that resolves to "owner/repo-name". The object can contain other attributes as well, but MUST contain the `name` property for batch mode to work correctly.

Example of a batch JSON file (_repositories.json_):

```json
[
    {
        "name": "permafrost-dev/node-ray"
    },
    {
        "name": "permafrost-dev/vue-ray"
    },
    {
        "name": "permafrost-dev/alpinejs-ray"
    }
]
```

## Boosts

Boosts are stored by default in `~/.codeboost/boosts`, and examples can be found in the `examples` directory of the repository. [Read the docs](docs/boosts.md).

## Configuration

To use the [`codeboost` CLI](./docs/cli.md), create a file named `codeboost.config.js` in your current working directory or run `codeboost init` to create a default global configuration file.

The default configuration file is stored in `~/.codeboost/codeboost.config.js`. This file assumes that you have an environment variable named `CODEBOOST_GITHUB_TOKEN` that contains a valid GitHub personal access token with the `repo` scope. You may edit this file to use a different token or to change the default storage paths.

The configuration file should export a `default` configuration object with the following properties:

```typescript
export interface AppSettings {
    github_token: string;
    repository_storage_path: string;
    boosts_path: string;
    // create fork of each repository
    use_forks: boolean;
    // create pull request for each repository
    use_pull_requests: boolean;
    log_target: 'console' | 'file';
}
```

Example configuration file:

```javascript
module.exports.default = {
    github_token: '$CODEBOOST_GITHUB_TOKEN',
    repository_storage_path: `${__dirname}/repositories`,
    boosts_path: `${__dirname}/boosts`,
    use_forks: true,
    use_pull_requests: true,
    log_target: 'console',
};
```

> Note that the `github_token` property can be set to a string value or an environment variable name prefixed with a '$'.
> If the value is an environment variable name, the value of the environment variable will be used.

If you are working on repositories that you have push access to and don't want to create forks or pull requests, you can set the `use_forks` and `use_pull_requests` properties to `false`. This will cause `codeboost` to commit directly to the main branch of the repository.

If you disable `use_forks` but not `use_pull_requests`, a separate branch will be created on the repository and a pull request will be created for that branch. Enabling `use_forks` automatically enables `use_pull_requests`.

## Development Setup

```bash
npm install

npm run dev
```

## Testing

`codeboost` uses Jest for unit tests. To run the test suite:

`npm run test`

---

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

-   [Patrick Organ](https://github.com/patinthehat)
-   [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
