import { Application } from '@/lib/Application';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { AppSettings } from '@/lib/AppSettings';
import { CodeBoost } from '@/index';
import fs from 'fs';

it('executeInit() should create the global config directory and config file if they do not exist', () => {
    const homePath = `${__dirname}/../fixtures/temp`;

    const instance = new Application();
    const consoleMock = jest.spyOn(console, 'log');

    instance.executeInit(homePath);

    expect(existsSync(`${homePath}/.codeboost`)).toBeTruthy();
    expect(existsSync(`${homePath}/.codeboost/codeboost.config.js`)).toBeTruthy();
    expect(console.log).toHaveBeenLastCalledWith(`${chalk.greenBright('✓')} codeboost initialized`);

    consoleMock.mockRestore();
});

it('initCodeBoost() should initialize codeboost', async () => {
    const instance = new Application();
    const settings = <AppSettings>{
        github_token: 'token',
        repository_storage_path: '/tmp/repositories',
        boosts_path: '/tmp/boosts',
        use_forks: true,
        use_pull_requests: true,
        log_target: ['console'],
    };
    const repoName = 'owner1/repoName';
    const initMock = jest.spyOn(CodeBoost.prototype, 'init').mockReturnValue(Promise.resolve());

    await instance.initCodeBoost(repoName, settings);

    expect(CodeBoost.prototype.init).toHaveBeenCalledTimes(1);

    initMock.mockRestore();
});

// it('executeRun() should run codeboost on the provided repository', async () => {
//     const instance = new Application();
//     const repoName = 'repoName';
//     const boostName = 'boostName';
//     const options = {
//         dryRun: true,
//         historyFn: '/tmp/history.json',
//     };
//     const settings = <AppSettings>{
//         github_token: 'token',
//         repository_storage_path: '/tmp/repositories',
//         boosts_path: '/tmp/boosts',
//         use_forks: true,
//         use_pull_requests: true,
//         log_target: 'console',
//     };
//     const codeboostMock = jest.mock('@/lib/CodeBoost');

//     const runBoostMock = jest.fn();
//     const saveMock = jest.fn();
//     //const boostMock = jest.spyOn(Boost.prototype, 'constructor');
//     jest.spyOn(instance, 'init').mockReturnValue(Promise.resolve(settings));
//     // @ts-ignore
//     jest.spyOn(instance, 'initCodeBoost').mockReturnValue(Promise.resolve(codeboostMock));
//     // @ts-ignore
//     const runBoostSpy = jest.spyOn(CodeBoost.prototype, 'runBoost').mockImplementation(async (boost: string | Boost, args: string[]) => {
//         return codeboostMock.mocked(CodeBoost.prototype);
//     });
//     jest.spyOn(HistoryManager.prototype, 'save').mockImplementation(saveMock)
//     jest.spyOn(BatchManager.prototype, 'getBatch').mockReturnValue([]);

//     await instance.executeRun(repoName, boostName, options);

//     expect(instance.init).toHaveBeenCalledWith(options);
//     expect(instance.initCodeBoost).toHaveBeenCalledWith(repoName, settings);
//     expect(runBoostSpy).toHaveBeenCalledWith(boostName, ['8.2']);
//     expect(instance.historyManager.save).toHaveBeenCalled();

//     jest.restoreAllMocks();
// });

describe('Application', () => {
    let app;

    const mockConfigFilename = 'fake/config/filename.js';

    beforeEach(() => {
        app = new Application();
    });

    describe('getConfigFilename', () => {
        it('should return the specified config filename if provided', () => {
            const fakeHomeDir = '/fake/home/dir';

            const osMock = jest.mock('os', () => ({ userInfo: jest.fn(() => ({ homedir: fakeHomeDir })) }));

            const fsMock = jest.mock('fs', () => ({ existsSync: jest.fn() }));

            app.specifiedConfigFilename = true;
            app.configFilename = mockConfigFilename;

            const result = app.getConfigFilename(fakeHomeDir);
            expect(result).toBe(mockConfigFilename);

            jest.restoreAllMocks();
        });

        it('should return the config filename from the first location it is found in the list of config filenames', () => {
            const fakeHomeDir = '/fake/home/dir';

            const osMock = jest.mock('os', () => ({ userInfo: jest.fn(() => ({ homedir: fakeHomeDir })) }));

            const fsMock = jest.mock('fs', () => ({ existsSync: jest.fn() }));

            const origFn = fs.existsSync;
            // Set up the mock file system so that the config file is found in the second location in the list
            fs.existsSync = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(false);

            const result = app.getConfigFilename(fakeHomeDir);

            const expectedConfigFilename = require('path').join('/fake/home/dir', 'codeboost.config.js');
            expect(result).toBe(expectedConfigFilename);

            jest.restoreAllMocks();
            fs.existsSync = origFn;
        });

        it('should return the default config filename if the config file is not found in any of the specified locations', () => {
            const fakeHomeDir = '/fake/home/dir';

            const osMock = jest.mock('os', () => ({ userInfo: jest.fn(() => ({ homedir: fakeHomeDir })) }));

            const fsMock = jest.mock('fs', () => ({ existsSync: jest.fn() }));

            // Set up the mock file system so that the config file is not found in any of the locations
            const origFn = fs.existsSync;
            fs.existsSync = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false);

            const result = app.getConfigFilename(fakeHomeDir);
            expect(result).toBe(app.configFilename);

            jest.restoreAllMocks();
            fs.existsSync = origFn;
        });
    });
});
