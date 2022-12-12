/* eslint-disable sort-keys */

import { Boost } from '@/lib/Boost';
import { CodeBoost } from '@/lib/CodeBoost';
import { BoostConfiguration } from '@/types/BoostConfiguration';
import { FakeHistoryManager } from '@tests/fakes/FakeHistoryManager';

const createBoost = (path, config = {}, historyMgr: any = null, codeboost: any = null) => {
    historyMgr = historyMgr ?? new FakeHistoryManager();
    codeboost = codeboost ?? new CodeBoost(historyMgr);

    const boostConfig = Object.assign({}, require(`${path}/boost.js`).default, config);
    const result = new Boost(codeboost, path, boostConfig);
    result.path = result.path.replace(__dirname, '.');

    return result;
};

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
    const config = { repository_limits: { max_runs_per_version: 1, minutes_between_runs: 5 } };
    const boost = createBoost(`${__dirname}/../fixtures/test-boost-1`, config, new FakeHistoryManager());

    expect(boost.scripts[0]).toBeInstanceOf(Function);

    const keys = Object.keys(boost);
    keys.sort();

    expect(keys).toMatchSnapshot();
});

it('respects the max runs per version limit', async () => {
    const config = { repository_limits: { max_runs_per_version: 1, minutes_between_runs: 5 } };
    const historyMgr = new FakeHistoryManager();
    const boost = createBoost(`${__dirname}/../fixtures/test-boost-1`, config, historyMgr);

    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, '0.0.0', 'owner1/name1');
    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, boost.version, 'owner1/name1');
    expect(boost.canRunOnRepository('owner1/name1')).toBeFalsy();
});

it('respects the min minutes between runs limit', async () => {
    const config = { repository_limits: { max_runs_per_version: 999, minutes_between_runs: 5 } };
    const historyMgr = new FakeHistoryManager();
    const boost = createBoost(`${__dirname}/../fixtures/test-boost-1`, config, historyMgr);

    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, boost.version, 'owner1/name1', 10);
    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, boost.version, 'owner1/name1', 3);
    expect(boost.canRunOnRepository('owner1/name1')).toBeFalsy();
});

it('does not consider skipped runs when determining if limits apply', async () => {
    const config = { repository_limits: { max_runs_per_version: 1, minutes_between_runs: 5 } };
    const historyMgr = new FakeHistoryManager();
    const boost = createBoost(`${__dirname}/../fixtures/test-boost-1`, config, historyMgr);

    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSkippedItem(boost.id, boost.version, 'owner1/name1', 3);
    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, boost.version, 'owner1/name1', 3);
    expect(boost.canRunOnRepository('owner1/name1')).toBeFalsy();
});

it('does not consider runs for other repositories when determining if limits apply', async () => {
    const config = { repository_limits: { max_runs_per_version: 1, minutes_between_runs: 5 } };
    const historyMgr = new FakeHistoryManager();
    const boost = createBoost(`${__dirname}/../fixtures/test-boost-1`, config, historyMgr);

    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, boost.version, 'owner2/name2', 3);
    expect(boost.canRunOnRepository('owner1/name1')).toBeTruthy();
    historyMgr.addSucceededItem(boost.id, boost.version, 'owner1/name1', 3);
    expect(boost.canRunOnRepository('owner1/name1')).toBeFalsy();
});

it('mocks a class method', () => {
    const runScriptsMock = jest.spyOn(Boost.prototype, 'runScripts').mockImplementation(async () => {});

    const boost = createBoost(`${__dirname}/../fixtures/test-boost-1`);
    boost.runScripts(<any>{});

    expect(runScriptsMock).toHaveBeenCalledTimes(1);

    runScriptsMock.mockRestore();
});

it(`runs all of a boost's scripts synchronously`, async () => {
    const boost = createBoost(`${__dirname}/../fixtures/test-boost-1`, { scripts: { parallel: false, files: [] } });
    boost.scripts = [ jest.fn(), jest.fn() ];

    await boost.runScripts(<any>{});

    boost.scripts.forEach(script => expect(script).toHaveBeenCalledTimes(1));
});

it(`runs all of a boost's scripts asynchronously`, async () => {
    const boost = createBoost(`${__dirname}/../fixtures/test-boost-1`, { scripts: { parallel: true, files: [] } });
    boost.scripts = [ jest.fn(), jest.fn() ];

    await boost.runScripts(<any>{});

    boost.scripts.forEach(script => expect(script).toHaveBeenCalledTimes(1));
});
