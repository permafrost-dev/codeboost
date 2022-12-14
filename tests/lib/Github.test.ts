import { createOctokit, Github, initOctokit } from '@/lib/github';
import { Repository } from '@/lib/Repository';

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
