import { AppSettings } from '@/lib/AppSettings';
import { BoostHistory, BoostHistoryItem, BoostHistoryItemState } from '@/types/BoostHistory';
import { CodeBoost } from '@/lib/CodeBoost';
import { versionToShortVersion } from '@/lib/helpers';
import { Repository } from '@/lib/Repository';
import { Tools } from '@/lib/Tools';
import { BoostConfiguration } from '@/types/BoostConfiguration';
import edge from 'edge.js';
import { existsSync, readFileSync } from 'fs';
import semver from 'semver';
import { SimpleGit } from 'simple-git';

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
    protected codeBoost!: CodeBoost;
    protected config!: BoostConfiguration;
    protected appSettings!: AppSettings;
    protected repository: Repository | null = null;

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

    constructor(codeBoost: CodeBoost, path: string, config: BoostConfiguration, appSettings: AppSettings) {
        this.codeBoost = codeBoost;
        this.path = `${path}/${config.version}`;
        this.id = config.id;
        this.version = config.version;

        this.repositoryLimits = {
            maxRunsPerVersion: config.repository_limits.max_runs_per_version,
            minutesBetweenRuns: config.repository_limits.minutes_between_runs,
        };

        this.pullRequest = this.loadPullRequest(config.pull_request);
        this.scripts = this.loadScripts(config.scripts.files);
        this.actions = config.actions;

        this.config = Object.assign({}, config);
        this.appSettings = appSettings;
    }

    public get history(): BoostHistory {
        return this.codeBoost.historyManager.for(this.config.id);
    }

    public log(message) {
        this.codeBoost.log(message, [{ boost: this.id, repository: this.repository?.fullRepositoryName() }]);
    }

    public loadPullRequest(pullRequest: Record<string, any>) {
        return {
            title: pullRequest.title,
            body: pullRequest.body,
            branch: `${pullRequest.branch}-v${versionToShortVersion(this.version)}`,
        };
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
        const historyItem: BoostHistoryItem = this.codeBoost.historyManager.createEntry({
            boost: this.id,
            version: this.version,
            repository: repository.fullRepositoryName(),
            started_at: new Date().toISOString(),
            finished_at: null,
            state: BoostHistoryItemState.RUNNING,
            pull_request: null,
        });

        this.repository = repository;

        if (!this.canRunOnRepository(repository)) {
            this.log(`Cannot run on ${repository.fullRepositoryName()}`);

            historyItem.state = BoostHistoryItemState.SKIPPED;
            historyItem.finished_at = new Date().toISOString();

            this.log('Done.');

            return false;
        }

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

        let pr: any = null;

        await repository.checkout(this.pullRequest.branch);

        try {
            const initFn = require(`${this.path}/init.js`).handler;

            await initFn(params);
        } catch (e) {
            this.log(e);
        }

        try {
            if (!this.config.scripts.parallel) {
                for (const script of this.scripts) {
                    await script(params);
                }
            } else {
                await Promise.allSettled(this.scripts.map(script => script(params)));
            }
        } catch (e) {
            this.log(e);
        }

        if (this.changedFiles.length > 0) {
            try {
                //await repository.pushToFork(this.pullRequest.branch);
            } catch (e) {
                this.log(e);
            }

            try {
                const loadStringOrFile = (value: string) => {
                    if (existsSync(this.path + '/' + value)) {
                        return readFileSync(this.path + '/' + value, { encoding: 'utf8' });
                    }
                    return value;
                };

                const title = await edge.renderRaw(loadStringOrFile(this.pullRequest.title), { boost: this, state: () => this.state });
                const body = await edge.renderRaw(loadStringOrFile(this.pullRequest.body), { boost: this, state: () => this.state });

                pr = null; //await Github.createPullRequest(repository, this.pullRequest.branch, title.trim(), body.trim());
                //this.log(`created pull request #${pr.number}`);
                this.log('skipping pr creation');
            } catch (e: any) {
                this.log(e.message);
            }
        }

        historyItem.finished_at = new Date().toISOString();
        historyItem.state = BoostHistoryItemState.SUCCEEDED;
        historyItem.pull_request = pr;

        this.log('Done.');
    }

    public canRunOnRepository(repo: Repository) {
        // get runs for this boost version and for the current repository,
        // but don't include skipped runs
        const runs = this.history
            .filter((item: any) => {
                return item.boost === this.id && item.version === this.version && item.repository === repo.fullRepositoryName();
            })
            .filter(run => run.state !== BoostHistoryItemState.SKIPPED);

        // boost has run too many times.
        // use > instead of >= because the current boost run is already included in the runs
        if (runs.length > this.repositoryLimits.maxRunsPerVersion) {
            return false;
        }

        // check the time between runs
        for (const item of runs) {
            const runDate = new Date(item.date);
            const now = new Date();
            const diff = (now.getTime() - runDate.getTime()) / 1000 / 60;

            // the minimum time between runs has not passed, so don't run again
            if (diff < this.repositoryLimits.minutesBetweenRuns) {
                return false;
            }
        }

        // check for any open pull requests
        if (runs.filter(item => item.pull_request !== null).length) {
            //
        }

        return true;
    }
}
