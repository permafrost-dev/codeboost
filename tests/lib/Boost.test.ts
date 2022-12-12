/* eslint-disable sort-keys */

import { Boost } from '@/lib/Boost';
import { CodeBoost } from '@/lib/CodeBoost';
import { BoostConfiguration } from '@/types/BoostConfiguration';
import { FakeHistoryManager } from '@tests/fakes/FakeHistoryManager';
import dayjs from 'dayjs';

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

    const boost = new Boost(new CodeBoost(new FakeHistoryManager()), 'path', boostConfig);

    const keys = Object.keys(boost);
    keys.sort();

    expect(keys).toMatchSnapshot();
});

it('loads a boost from a path', async () => {
    const boostConfig = require(`${__dirname}/../fixtures/test-boost-1/boost.js`).default;
    const boost = new Boost(new CodeBoost(new FakeHistoryManager()), `${__dirname}/../fixtures/test-boost-1`, boostConfig);
    boost.path = boost.path.replace(__dirname, '.');

    expect(boost.scripts[0]).toBeInstanceOf(Function);

    const keys = Object.keys(boost);
    keys.sort();

    expect(keys).toMatchSnapshot();
});

it('respects the max runs per version limit', async () => {
    const historyMgr = new FakeHistoryManager();
    const codeboost = new CodeBoost(historyMgr);
    const boostConfig: BoostConfiguration = require(`${__dirname}/../fixtures/test-boost-1/boost.js`).default;
    boostConfig.repository_limits.max_runs_per_version = 1;

    const boost = new Boost(codeboost, `${__dirname}/../fixtures/test-boost-1`, boostConfig);
    boost.path = boost.path.replace(__dirname, '.');

    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, '0.0.0', 'owner1/name1');
    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, boost.version, 'owner1/name1');
    expect(boost.canRunOnRepository('owner1/name1')).toBeFalsy();
});

it('respects the min minutes between runs limit', async () => {
    const historyMgr = new FakeHistoryManager();
    const codeboost = new CodeBoost(historyMgr);
    const boostConfig: BoostConfiguration = require(`${__dirname}/../fixtures/test-boost-1/boost.js`).default;
    boostConfig.repository_limits.max_runs_per_version = 999;
    boostConfig.repository_limits.minutes_between_runs = 5;

    const boost = new Boost(codeboost, `${__dirname}/../fixtures/test-boost-1`, boostConfig);
    boost.path = boost.path.replace(__dirname, '.');

    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, boost.version, 'owner1/name1', 10);
    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, boost.version, 'owner1/name1', 3);
    expect(boost.canRunOnRepository('owner1/name1')).toBeFalsy();
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
