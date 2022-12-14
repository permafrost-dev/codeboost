import { CodeBoost, loadSettings, Repository } from '@/index';
import { FakeHistoryManager } from '@tests/fakes/FakeHistoryManager';

it('initializes with the correct values', async () => {
    const appSettings = loadSettings(`${__dirname}/../fixtures/app-settings.js`);
    const codeboost = new CodeBoost(appSettings, new FakeHistoryManager());

    codeboost.init(new Repository('owner1/name1', `${__dirname}/../../fixtures/temp`), appSettings);

    expect(codeboost.historyManager).toBeInstanceOf(FakeHistoryManager);
});

it('prepares the repository once', async () => {
    const cloneMock = jest.spyOn(Repository.prototype, 'clone').mockImplementation(async () => {});
    const prepareMock = jest.spyOn(Repository.prototype, 'prepare').mockImplementation(async () => {});
    const createFork = jest.spyOn(Repository.prototype, 'createFork').mockImplementation(async () => {});

    const appSettings = loadSettings(`${__dirname}/../fixtures/app-settings.js`);
    appSettings.use_forks = true;

    const codeboost = new CodeBoost(appSettings, new FakeHistoryManager());
    const repo = new Repository('owner1/name1', `${__dirname}/../../fixtures/temp`);
    codeboost.init(repo, appSettings);

    await codeboost.prepareRepository();
    await codeboost.prepareRepository();

    expect(cloneMock).toHaveBeenCalledTimes(1);
    expect(prepareMock).toHaveBeenCalledTimes(1);
    expect(createFork).toHaveBeenCalledTimes(1);

    createFork.mockRestore();
    cloneMock.mockRestore();
    prepareMock.mockRestore();
});
