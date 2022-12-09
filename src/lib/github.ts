import { APP_VERSION } from '@/lib/consts';
import { Octokit } from '@octokit/core';

let AppOctokitDefaults: typeof Octokit;

export function initOctokit(token: string) {
    AppOctokitDefaults = Octokit.defaults({
        auth: token,
        log: console,
        userAgent: `codeboost/v${APP_VERSION}`,
    });
}

export function createOctokit(): Octokit {
    return new AppOctokitDefaults();
}
