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

it('gets the default and current branch names', async () => {
    const repository = new Repository('laravel/framework', tempPath);
    repository.path = `${__dirname}/../..`;

    const mainBranchName = await repository.defaultBranch();
    const branch = await repository.currentBranch();

    expect(branch).toBe(mainBranchName);
});
