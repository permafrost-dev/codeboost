---
title: CLI Reference
description: Learn how to use the CodeBoost CLI to create and run boosts.
---

# CLI Reference

CodeBoost comes with a CLI that can be used to create and run boosts.

## Initializing CodeBoost

You must initialize `codeboost` before you can run any boosts. You only need to run this command once to initialize the global configuration file:

```bash
codeboost init
```

## Configuration

To use the `codeboost` CLI, create a file named `boost.config.js` in your current working directory
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

Example:

```javascript
/** @type {import('codeboost').BoostConfiguration} */
module.exports.default = {
    github_token: '$GITHUB_TOKEN',
    repository_storage_path: `${__dirname}/storage/repositories`,
    use_forks: true,
    use_pull_requests: true,
    log_target: ['console', 'file'],
};
```

## Running Boosts

```bash
codeboost run -r <repository> <boost>
```
