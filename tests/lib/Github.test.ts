import nock from 'nock';
import { createOctokit, Github, initOctokit } from '@/lib/github';
import { Repository } from '@/lib/Repository';
import { parseFullRepositoryName } from '@/lib/stringHelpers';

const tempPath = `${__dirname}/../fixtures/temp`;

beforeAll(() => {
    initOctokit(process.env.GITHUB_TOKEN || '');
});

it('gets a repository', async () => {
    const octokit = createOctokit();

    const repository = new Repository('permafrost-dev/node-ray', tempPath);
    const result = await Github.getRepository(repository.info, octokit);

    expect(result).toBeDefined();
    expect(result.full_name).toBe('permafrost-dev/node-ray');
});

it('throws an error when getting a repository that does not exist', async () => {
    const octokit = createOctokit();
    const repository = new Repository('permafrost-dev/does-not-exist', tempPath);

    await expect(Github.getRepository(repository.info, octokit)).rejects.toThrow();
});

it('throws an error when getting the current user with an invalid token', async () => {
    initOctokit('invalid-token');
    const octokit = createOctokit();

    await expect(Github.currentUser(octokit)).rejects.toThrow();
});

it('throws an error when merging a pull request that does not exist', async () => {
    const octokit = createOctokit();
    const repository = new Repository('permafrost-dev/node-ray', tempPath);

    await expect(Github.mergePullRequest(repository, 999999, octokit)).rejects.toThrow();
});

it('throws an error when creating a PR on a repository that does not exist', async () => {
    const repository = new Repository('permafrost-dev/does-not-exist', tempPath);
    Github.setCache({ currentUser: { login: 'patinthehat' } });

    await expect(
        Github.createPullRequest(parseFullRepositoryName(repository.fullRepositoryName()), 'missing-branch', 'main', 'test', 'test', null),
    ).rejects.toThrow();
});

it('throws an error when forking a PR onto itself exist', async () => {
    const repository = new Repository('patinthehat/does-not-exist', tempPath);
    Github.setCache({ currentUser: { login: 'patinthehat' } });

    initOctokit('test-token');
    const octokit = createOctokit();

    const requestFn = jest.fn().mockImplementation(() => {
        return Promise.resolve({ status: 201, data: { test: 1 } });
    });
    octokit.request = requestFn;

    await expect(Github.forkRepository(parseFullRepositoryName(repository.fullRepositoryName()), octokit)).rejects.toThrow();
});

it('creates a pull request on a repository', async () => {
    const repository = new Repository('permafrost-dev/does-not-exist', tempPath);
    Github.setCache({ currentUser: { login: 'patinthehat' } });

    initOctokit('test-token');
    const octokit = createOctokit();

    const requestFn = jest.fn().mockImplementation(() => {
        return Promise.resolve({ status: 201, data: { test: 1 } });
    });

    octokit.request = requestFn;

    await expect(
        Github.createPullRequest(parseFullRepositoryName(repository.fullRepositoryName()), 'branch-name', 'main', 'test', 'test', octokit),
    ).resolves.toStrictEqual({ test: 1 });

    requestFn.mockRestore();
});

it('merges a pull request on a repository', async () => {
    const repository = new Repository('permafrost-dev/does-not-exist', tempPath);
    Github.setCache({ currentUser: { login: 'patinthehat' } });

    initOctokit('test-token');
    const octokit = createOctokit();

    const requestFn = jest.fn().mockImplementation(() => {
        return Promise.resolve({ status: 200, data: { test: 1 } });
    });

    octokit.request = requestFn;

    await expect(Github.mergePullRequest(parseFullRepositoryName(repository.fullRepositoryName()), 123, octokit)).resolves.toStrictEqual({ test: 1 });

    requestFn.mockRestore();
});

it('forks a repository', async () => {
    const repository = new Repository('permafrost-dev/does-not-exist', tempPath);
    Github.setCache({ currentUser: { login: 'patinthehat' } });

    initOctokit('test-token');
    const octokit = createOctokit();

    const requestFn = jest.fn().mockImplementation(() => {
        return Promise.resolve({ status: 202, data: { test: 1 } });
    });

    octokit.request = requestFn;

    await expect(Github.forkRepository(parseFullRepositoryName(repository.fullRepositoryName()), octokit)).resolves.toStrictEqual({ test: 1 });

    requestFn.mockRestore();
});

it('gets the current user', async () => {
    initOctokit('test-token');
    const octokit = createOctokit();
    Github.setCache({ currentUser: null });

    const requestFn = jest.fn().mockImplementation(() => {
        return Promise.resolve({ status: 200, data: { login: 'test-user' } });
    });

    octokit.request = requestFn;

    await expect(Github.currentUser(octokit)).resolves.toStrictEqual({ login: 'test-user' });

    requestFn.mockRestore();
});
