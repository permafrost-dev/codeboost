import { Repository } from '@/lib/Repository';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

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

// it('clones a repository', async () => {
//     const repository = new Repository('laravel/framework', tempPath);

//     await repository.clone();

//     expect(existsSync(`${__dirname}/../fixtures/temp/laravel/framework`)).toBeTruthy();
//     expect(existsSync(`${__dirname}/../fixtures/temp/laravel/framework/.git`)).toBeTruthy();
// });

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
