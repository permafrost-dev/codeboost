import { Github } from '@/index';
import { Repository } from '@/lib/Repository';
import { execSync } from 'child_process';
import fs, { existsSync } from 'fs';
import path from 'path';
import child_process from 'child_process';

const tempPath = `${__dirname}/../fixtures/temp`;

beforeEach(() => {
    if (existsSync(`${tempPath}/laravel/framework`)) {
        execSync(`rm -rf ${tempPath}/laravel/framework`);
    }
});

it('sets properties correctly on create', async () => {
    const repository = new Repository('owner/name', 'path');

    expect(repository).toBeInstanceOf(Repository);

    expect(repository.name).toBe('name');
    expect(repository.owner).toBe('owner');
    expect(repository.path).toBe('path/owner/name');

    expect(repository).toMatchSnapshot();
});

it('gets the current branch names', async () => {
    const repository = new Repository('permafrost-dev/codeboost', tempPath);
    repository.path = `${__dirname}/../..`;

    const mainBranchName = 'main';
    const branch = await repository.currentBranch();

    expect(branch).toBe(mainBranchName);
});

it('gets a list of local branches', async () => {
    const repository = new Repository('permafrost-dev/codeboost', tempPath);
    repository.path = `${__dirname}/../..`;

    const mainBranchName = 'main';
    const branches = await repository.localBranches();

    expect(branches.all).toContain(mainBranchName);
});

it('checks if it is on a branch', async () => {
    const repository = new Repository('permafrost-dev/codeboost', tempPath);
    repository.path = `${__dirname}/../..`;

    const mainBranchName = 'main';
    const isOnBranch = await repository.onBranch(mainBranchName);

    expect(isOnBranch).toBeTruthy();
});

if (typeof process.env.CI !== 'undefined') {
    it('checks out a new branch', async () => {
        const repository = new Repository('permafrost-dev/codeboost', tempPath);
        repository.path = `${__dirname}/../..`;

        const randomInt = Math.floor(Math.random() * 10000) + 1;
        const newBranchName = `test-branch-${randomInt}`;
        await repository.checkout(newBranchName);

        const isOnBranch = await repository.onBranch(newBranchName);

        expect(isOnBranch).toBeTruthy();
    });
}

it('throws an error when forking a repository onto its own user', async () => {
    const repository = new Repository('permafrost-dev/does-not-exist', tempPath);
    Github.setCache({ currentUser: { login: 'permafrost-dev' } });

    await expect(repository.createFork()).rejects.toThrow();
});

it('throws an error when forking a repository that does not exist', async () => {
    const repository = new Repository('permafrost-dev/does-not-exist', tempPath);
    Github.setCache({ currentUser: { login: 'patinthehat' } });

    await expect(repository.createFork()).rejects.toThrow();
});

it('throws an error when pushing to a fork on a repository that does not exist', async () => {
    const repository = new Repository('permafrost-dev/does-not-exist', tempPath);
    Github.setCache({ currentUser: { login: 'patinthehat' } });

    await expect(repository.pushToFork('missing-branch')).rejects.toThrow();
});

it('does nothing if cloning a repository that already exists locally', async () => {
    const repository = new Repository('laravel/framework', tempPath);
    repository.path = __dirname;

    await expect(repository.clone()).toBeTruthy();
});

it('creates the parent directory if it does not exist', async () => {
    // Mock the `dirname` and `existsSync` functions.
    jest.spyOn(path, 'dirname').mockReturnValue(tempPath);
    jest.spyOn(fs, 'existsSync').mockReturnValue(false).mockReturnValueOnce(true);
    const mkdirMock = jest.mock('fs', () => {
        return { mkdirSync: jest.fn().mockReturnValue('') };
    });

    const execSpy = jest.mock('child_process', () => {
        return { execSync: jest.fn().mockReturnValue('') };
    });

    const repo = new Repository('owner/name', tempPath + '/owner/name');

    child_process.execSync = execSpy.fn();
    fs.mkdirSync = mkdirMock.fn();

    await expect(repo.clone()).toBeTruthy();

    jest.restoreAllMocks();
});

it('clones the repository if it does not exist', async () => {
    // Mock the `dirname` and `existsSync` functions.
    const dirnameSpy = jest.spyOn(path, 'dirname').mockReturnValue('/parent/dir');
    const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const execSpy = jest.mock('child_process', () => {
        return { execSync: jest.fn().mockReturnValue('') };
    });
    const mocks = [dirnameSpy, existsSpy];

    // Create an instance of the class.
    const repo = new Repository('owner/name', tempPath + '/owner/name');

    await expect(repo.clone()).toBeTruthy();

    mocks.map(mock => mock.mockRestore());
    jest.restoreAllMocks();
});
