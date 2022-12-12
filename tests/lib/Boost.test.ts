/* eslint-disable sort-keys */

import { Boost } from '@/lib/Boost';
import { CodeBoost } from '@/lib/CodeBoost';
import { HistoryManager } from '@/lib/HistoryManager';
import { BoostConfiguration } from '@/types/BoostConfiguration';

it('sets the correct properties on create', async () => {
    const boostConfig: BoostConfiguration = {
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
            files: [],
        },
        actions: [],
    };

    const boost = new Boost(new CodeBoost(new HistoryManager('')), 'path', boostConfig, {} as any);

    const keys = Object.keys(boost);
    keys.sort();

    expect(keys).toMatchSnapshot();
});

it('loads a boost from a path', async () => {
    const boostConfig = require(`${__dirname}/../fixtures/test-boost-1/boost.js`).default;
    const boost = new Boost(new CodeBoost(new HistoryManager('')), `${__dirname}/../fixtures/test-boost-1`, boostConfig, {} as any);
    boost.path = boost.path.replace(__dirname, '.');

    expect(boost.scripts[0]).toBeInstanceOf(Function);

    const keys = Object.keys(boost);
    keys.sort();

    expect(keys).toMatchSnapshot();
});

// it(`runs a boost's scripts in parallel`, async () => {
//     const boostConfig = require(`${__dirname}/../fixtures/test-boost-1/boost.js`).default;
//     const boost = new Boost(`${__dirname}/../fixtures/test-boost-1`, boostConfig);

//     const mocked = jest.spyOn(boost.scripts[0], 'call');
//     mocked.mockReset();

//     const repository = new Repository('owner1/name1', `${__dirname}/../fixtures/repos`);
//     await boost.run(repository);

//     expect(mocked).toHaveBeenCalledTimes(1);
// });

// it(`runs a boost's scripts synchronously`, async () => {
//     const boostConfig: BoostConfiguration = require(`${__dirname}/../fixtures/test-boost-1/boost.js`).default;
//     boostConfig.scripts.parallel = false;

//     const boost = new Boost(`${__dirname}/../fixtures/test-boost-1`, boostConfig);

//     const mocked = jest.spyOn(boost.scripts[0], 'call');
//     mocked.mockReset();

//     const repository = new Repository('owner1/name1', `${__dirname}/../fixtures/repos`);
//     await boost.run(repository);

//     expect(mocked).toHaveBeenCalledTimes(1);
// });
