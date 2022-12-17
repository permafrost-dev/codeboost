<p align="center">
    <img src="https://static-assets.permafrost.dev/images/projects/codeboost/logo.svg" width="100" height="100" alt="codeboost logo"/>
</p>

# codeboost

---

<p align="center">
    <img src="https://github.com/permafrost-dev/codeboost/actions/workflows/run-tests.yml/badge.svg?a=1" alt="Run Tests"> <img alt="Codecov" src="https://codecov.io/gh/permafrost-dev/codeboost/branch/main/graph/badge.svg?token=qYptYEWlm7&style=flat-square"> <img src="https://img.shields.io/github/license/permafrost-dev/codeboost?style=flat-square" alt="license">
    <br/>
    <img src="https://img.shields.io/codeclimate/tech-debt/permafrost-dev/codeboost?label=technical%20debt&amp;logo=codeclimate&amp;style=flat-square" alt="techdebt"> <img src="https://api.codeclimate.com/v1/badges/688e30d604cdcd93a262/maintainability" />
    <br/>
    <img alt="Depfu" src="https://img.shields.io/depfu/dependencies/github/permafrost-dev/codeboost?style=flat-square"> <img alt="npm downloads" src="https://img.shields.io/npm/dm/codeboost?style=flat-square">
</p>

`codeboost` is a CLI tool and library that allows you to run "boosts" on repositories. Boosts are small scripts that can be used to automate common tasks such as updating dependencies, fixing linting errors, or updating workflows to use a new version of a library.

`codeboost` makes it easy to run these tasks across multiple repositories at once, making maintenance of multiple repositories simple.

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
codeboost run -r <repository> <boost>
```

Run a boost on a batch of repositories:

```bash
codeboost run --batch repositories.json --size 3 <boost>
```

When running in batch mode, the `--size` option can be used to specify the number of repositories to process at once. The default is 1.
The `--batch` option can be used to specify a JSON file containing an array of objects that have a `name` property that resolves to "owner/repo-name". The object can contain other attributes as well, but MUST contain the name property for batch mode to work correctly.

## Configuration

To use the `codeboost` CLI, create a file named `boost.config.js` in your current working directory or run `codeboost init` to create a default configuration file.

This file should export a configuration object with the following properties:

```typescript
export interface AppSettings {
    github_token: string;
    repository_storage_path: string;
    boosts_path: string;
    use_forks: boolean;
    use_pull_requests: boolean;
    log_target: 'console' | 'file';
}
```

## Development

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
