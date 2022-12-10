import { Repository } from '@/lib/Repository';
import { Tools } from '@/lib/Tools';
import { BoostConfiguration } from '@/types/BoostConfiguration';
import { existsSync } from 'fs';
import { SimpleGit } from 'simple-git';
import semver from 'semver';
import { AppSettings } from '@/lib/AppSettings';
import { versionToShortVersion } from '@/lib/helpers';

export interface BoostScriptHandlerParameters {
    /** arguments passed in from the user */
    args: any[];
    /** the boost instance */
    boost: Boost;
    /** a simpleGit instance for the repository */
    git: SimpleGit;
    /** a collection of commonly-used libraries available to the boost scripts */
    libs: {
        fs: typeof import('fs');
        path: typeof import('path');
        semver: typeof import('semver');
    };
    /** the repository instance */
    repository: Repository;
    /** a collection of utility functions available to the boost scripts */
    tools: Tools;
}

export type BoostScriptHandler = (params: BoostScriptHandlerParameters) => any;

export class Boost {
    protected config!: BoostConfiguration;
    protected appSettings!: AppSettings;

    public path!: string;
    public id!: string;
    public version!: string;
    public repositoryLimits!: {
        maxRunsPerVersion: number;
        minutesBetweenRuns: number;
    };
    public pullRequest!: {
        title: string;
        body: string;
        branch: string;
    };
    public scripts!: any[];
    public actions!: any[];
    public state: Record<string, any> = {};
    public changedFiles: string[] = [];

    constructor(path: string, config: BoostConfiguration, appSettings: AppSettings) {
        this.path = `${path}/${config.version}`;
        this.id = config.id;
        this.version = config.version;
        this.repositoryLimits = {
            maxRunsPerVersion: config.repository_limits.max_runs_per_version,
            minutesBetweenRuns: config.repository_limits.minutes_between_runs,
        };
        this.pullRequest = config.pull_request;
        this.pullRequest.branch += `-v${versionToShortVersion(this.version)}`;

        this.scripts = this.loadScripts(config.scripts.files);
        this.actions = config.actions;

        this.config = Object.assign({}, config);
        this.appSettings = appSettings;
    }

    public loadScripts(scripts: string[]) {
        const result: any[] = [];

        for (const script of scripts) {
            const fn = `${this.path}/${script}`;

            if (!existsSync(fn)) {
                throw new Error(`Boost script not found: ${fn}`);
            }

            result.push(require(fn).handler);
        }

        return result;
    }

    public async run(repository: Repository, args: any[] = []) {
        const params: BoostScriptHandlerParameters = {
            args,
            boost: this,
            git: repository.git,
            libs: {
                fs: require('fs'),
                path: require('path'),
                semver,
            },
            repository,
            tools: new Tools(this, repository),
        };

        if (!this.appSettings.use_pull_requests) {
            this.pullRequest.branch = await repository.defaultBranch();
        }

        await repository.checkout(this.pullRequest.branch);

        if (!this.config.scripts.parallel) {
            for (const script of this.scripts) {
                await script(params);
            }
            return;
        }

        await Promise.allSettled(this.scripts.map(script => script(params)));
    }
}
