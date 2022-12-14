import { APP_VERSION } from '@/lib/consts';
import { RepositoryInfo } from '@/types/RepositoryInfo';
import { Octokit } from '@octokit/core';
import { throttling } from '@octokit/plugin-throttling';

let AppOctokitDefaults: typeof Octokit;

export function initOctokit(token: string) {
    AppOctokitDefaults = Octokit.defaults({
        auth: token,
        log: console,
        userAgent: `codeboost/v${APP_VERSION}`,
    });

    AppOctokitDefaults.plugin(throttling);
}

export function createOctokit(): Octokit {
    const result = new AppOctokitDefaults({
        throttle: {
            onRateLimit: (retryAfter, options, octokit, retryCount) => {
                result.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

                // retries twice
                if (retryCount < 2) {
                    result.log.info(`Retrying after ${retryAfter} seconds!`);
                    return true;
                }
            },
            onSecondaryRateLimit: (retryAfter, options, octokit) => {
                // does not retry, only logs a warning
                result.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);
            },
        },
    });

    return result;
}

/**
 * A class for interacting with the Github API
 */
export class Github {
    protected static cache = { currentUser: null as { login: string } | null };

    static async setCache(cache: any) {
        Github.cache = cache;
    }

    static async currentUser(octokit: Octokit | null = null) {
        octokit = octokit ?? createOctokit();

        if (Github.cache.currentUser) {
            return Github.cache.currentUser;
        }

        // get currently authenticated user
        const user = await octokit.request('GET /user');

        if (user.status !== 200) {
            throw new Error('Failed to get currently authenticated user');
        }

        Github.cache.currentUser = { login: user.data.login };

        return user.data;
    }

    /**
     * Attempts to fork a repository into the currently authenticated user's account.
     * Throws an error if the fork already exists.
     * @param {Repository} repository
     * @param {Octokit|null} octokit
     */
    static async forkRepository(repository: RepositoryInfo, octokit: Octokit | null = null) {
        octokit = octokit ?? createOctokit();

        const currentUserLogin = (await Github.currentUser(octokit)).login;

        if (currentUserLogin === repository.owner) {
            throw new Error(`Cannot fork repository ${repository.owner}/${repository.name} into itself`);
        }

        const result = await octokit.request(`POST /repos/${repository.owner}/${repository.name}/forks`, {
            owner: currentUserLogin,
            repo: this.name,
            default_branch_only: true,
        });

        if (result.status !== 202) {
            throw new Error(`Failed to create fork of ${repository.owner}/${repository.name}`);
        }

        return result.data;
    }

    static async getRepository(repository: RepositoryInfo, octokit: Octokit | null = null) {
        octokit = octokit ?? createOctokit();

        const result = await octokit.request(`GET /repos/${repository.owner}/${repository.name}`);

        if (result.status !== 200) {
            throw new Error(`Failed to get repository ${repository.owner}/${repository.name}`);
        }

        return result.data;
    }

    // create a pull request
    static async createPullRequest(
        repository: RepositoryInfo,
        branchName: string,
        defaultBranchName: string,
        title: string,
        body: string,
        octokit: Octokit | null = null,
    ) {
        octokit = octokit ?? createOctokit();

        const currentUsername = (await Github.currentUser(octokit)).login;

        const result = await octokit.request(`POST /repos/${repository.owner}/${repository.name}/pulls`, {
            owner: currentUsername,
            repo: repository.name,
            title,
            body,
            head: `${currentUsername}:${branchName}`,
            base: defaultBranchName,
        });

        if (result.status !== 201) {
            throw new Error(`Failed to create pull request for ${currentUsername}/${repository.name}`);
        }

        return result.data;
    }

    static async mergePullRequest(repository: RepositoryInfo, pullRequestNumber: number, octokit: Octokit | null = null) {
        octokit = octokit ?? createOctokit();

        const result = await octokit.request(`PUT /repos/${repository.owner}/${repository.name}/pulls/${pullRequestNumber}/merge`, {
            owner: repository.owner,
            repo: repository.name,
            pull_number: pullRequestNumber,
            merge_method: 'merge',
        });

        if (result.status !== 200) {
            throw new Error(`Failed to merge pull request for ${repository.owner}/${repository.name}`);
        }

        return result.data;
    }
}
