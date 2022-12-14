<p align="center">
    <img src="https://static.permafrost.dev/images/codeboost/logo.svg" width="100" height="100" alt="codeboost logo"/>
</p>

# codeboost

---

[![Run Tests](https://github.com/permafrost-dev/codeboost/actions/workflows/run-tests.yml/badge.svg)](https://github.com/permafrost-dev/codeboost/actions/workflows/run-tests.yml)

Automate changes to repositories

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

## Configuration

To use the `codeboost` CLI, create a file named `boost.config.js` in your current working directory or run `codeboost init` to create a default configuration file.

This file should export a configuration object with the following properties:

```typescript
export interface AppSettings {
    github_token: string;
    repository_storage_path: string;
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
