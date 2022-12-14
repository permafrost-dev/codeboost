# boosts

A Boost is a collection of scripts written in JavaScript/NodeJS that are used to automate common tasks in a repository and can be run in batches to process many repositories at once.

Boosts can be used to automate:

-   updating dependencies
-   adding/updating/removing files
-   bumping version numbers

## creating a boost

To create a boost, create a directory in the root of your repository named `boosts`. Inside this directory, create a directory named after your boost. For example, if you wanted to create a boost named `my-boost`, you would create a directory named `boosts/my-boost`.

The only requirement for a boost is that it contains a valid `boost.js` configuration file.

## boost configuration

Inside this directory, create a file named `boost.js`. This is the main configuration file for your boost. It should export a function named `handler` that takes a single argument, an object with the following properties:

```typescript
interface BoostConfiguration {
    /**
     * the id of the boost, which is the name of the directory that contains the boost.
     */
    id: string;

    /**
     * the version of the boost, which should be a semver version number like `1.0.0`.
     */
    version: string;
    repository_limits: {
        max_runs_per_version: number;
        minutes_between_runs: number;
    };
    pull_request: {
        /**
         * the title of the pull request, which can be a file path or a string.
         * the contents of the file or string are processed as a template using
         * edge.js.
         */
        title: string;
        /**
         * the body of the pull request, which can be a file path or a string.
         * the contents of the file or string are processed as a template using
         * edge.js.
         */
        body: string;
        branch: string;
    };
    scripts: {
        parallel: boolean;
        files: string[];
    };
    actions: any[];
}
```

## boost initialization

Inside the `boosts/my-boost` directory, create a file named `scripts/init.js`. This file is used to initialize your boost. It should export a function named `handler` that takes a single argument, an object with the following properties:

```typescript
export interface BoostScriptHandlerParameters {
    /** arguments passed in from the user */
    args: any[];
    /** the boost instance */
    boost: Boost;
    /** read-only object with information about the current boost run */
    currentRun: BoostHistoryItem;
    /** a simpleGit instance for the repository */
    git: SimpleGit;
    /** a collection of commonly-used libraries available to the boost scripts */
    libs: {
        fs: typeof import('fs');
        path: typeof import('path');
        semver: typeof import('semver');
    };
    /** the repository instance */
    repository: Repository;
    /** a collection of utility functions available to the boost scripts */
    tools: Tools;
}
```

The script can perform any initialization tasks required for setup. It is run once and synchronously before the boost. During the boost, scripts are run asynchronously.

An example of a boost initialization script:

```javascript
const searchFilesForString = async searchString => {
    // search files for string
    // return array of files
};

module.exports.handler = async function ({ boost }) {
    boost.state.someGlobalVariable = 'some value';

    boost.state.files = await searchFilesForString('hello');
};
```

## boost execution

When a boost is run, it will first clone/fork the repository, then check out the branch specified in the `pull_request.branch` property of the `boost.js` configuration file. It then executes the `init.js` script, followed by all scripts defined in the configuration.

Scripts are run in parallel by default, but can be run synchronously by setting the `parallel` property to `false` in the `boost.js` configuration file.

Once finished, the boost will push the changes to the forked repository (boost scripts are responsbile for staging and committing the changes they make), then attempts to create a pull request.

## boost scripts

All boost scripts should exist under the `scripts` directory. The `scripts` directory can contain any number of files and subdirectories, and all scripts must be written - in NodeJS.

Boost scripts must export a function named `handler` that takes a single argument - an object with the following shape:

```typescript
export interface BoostScriptHandlerParameters {
    /** arguments passed in from the user */
    args: any[];
    /** the boost instance */
    boost: Boost;
    /** read-only object with information about the current boost run */
    currentRun: BoostHistoryItem;
    /** a simpleGit instance for the repository */
    git: SimpleGit;
    /** a collection of commonly-used libraries available to the boost scripts */
    libs: {
        fs: typeof import('fs');
        path: typeof import('path');
        semver: typeof import('semver');
    };
    /** the repository instance */
    repository: Repository;
    /** a collection of utility functions available to the boost scripts */
    tools: Tools;
}
```

You may access any or all of these properties via object destructuring:

```javascript
module.exports.handler = async function ({ boost, git, libs, repository, tools }) {
    // do something
};
```

## boost state

Boosts have a `state` property that can be used to store data between scripts. This is useful for storing data that is used by multiple scripts.

Access this property via the `boost` object passed to the `handler` function:

```javascript
module.exports.handler = async function ({ boost, git, libs, repository, tools }) {
    boost.state.someGlobalVariable = 'some value';
};
```
