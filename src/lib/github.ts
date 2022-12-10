import { APP_VERSION } from '@/lib/consts';
import { Repository } from '@/lib/Repository';
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

                if (retryCount < 1) {
                    // only retries once
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

export class Github {
    protected static cache = {};

    static async currentUser(octokit: Octokit | null = null) {
        octokit = octokit ?? createOctokit();

        // get currently authenticated user
        const user = await octokit.request('GET /user');

        if (user.status !== 200) {
            throw new Error('Failed to get currently authenticated user');
        }

        return user.data;
    }

    static async forkRepository(repository: Repository, octokit: Octokit | null = null) {
        octokit = octokit ?? createOctokit();

        const result = await octokit.request(`POST /repos/${repository.owner}/${repository.name}/forks`, {
            owner: (await Github.currentUser(octokit)).login,
            repo: this.name,
            default_branch_only: true,
        });

        if (result.status !== 202) {
            throw new Error(`Failed to create fork of ${repository.owner}/${repository.name}`);
        }

        return result.data;
    }

    static async getRepository(repository: Repository, octokit: Octokit | null = null) {
        octokit = octokit ?? createOctokit();

        const currentUsername = (await Github.currentUser(octokit)).login;

        const result = await octokit.request(`GET /repos/${currentUsername}/${repository.name}`);

        if (result.status !== 200) {
            throw new Error(`Failed to get repository ${currentUsername}/${repository.name}`);
        }

        return result.data;
    }
}
