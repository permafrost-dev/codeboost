import { AppSettings } from '@/lib/AppSettings';
import { BoostHistory, BoostHistoryItem, BoostHistoryItemState } from '@/types/BoostHistory';
import { CodeBoost } from '@/lib/CodeBoost';
import { generateRunId, versionToShortVersion } from '@/lib/helpers';
import { Repository } from '@/lib/Repository';
import { Tools } from '@/lib/Tools';
import { BoostConfiguration } from '@/types/BoostConfiguration';
import edge from 'edge.js';
import { existsSync, readFileSync } from 'fs';
import semver from 'semver';
import { SimpleGit } from 'simple-git';
import dayjs from 'dayjs';

export interface BoostScriptHandlerParameters {
    /** arguments passed in from the user */
    args: any[];
    /** the boost instance */
    boost: Boost;
    /** information about the current boost run */
    currentRun: BoostHistoryItem;
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
    public runId: string;

    constructor(codeBoost: CodeBoost, boostPath: string, config: BoostConfiguration) {
        this.runId = generateRunId();
        this.codeBoost = codeBoost;
        this.path = `${boostPath}/${config.version}`;
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
        this.appSettings = codeBoost.appSettings;
    }

    public get history(): BoostHistory {
        return this.codeBoost.historyManager.for(this.id);
    }

    public log(message) {
        this.codeBoost.log(message, [{ boost: this.id, run_id: this.runId, repository: this.repository?.fullRepositoryName() }]);
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
        this.repository = repository;
        this.updatePullRequestBranch();

        // changes to historyItem properties will be reflected in the saved history automatically
        // as createEntry returns a proxy object
        const historyItem: BoostHistoryItem = this.codeBoost.historyManager.createEntry({
            run_id: this.runId,
            boost: this.id,
            version: this.version,
            repository: repository.fullRepositoryName(),
            started_at: new Date().toISOString(),
            finished_at: null,
            state: BoostHistoryItemState.RUNNING,
            pull_request: null,
        });

        if (!this.canRunOnRepository(repository)) {
            historyItem.state = BoostHistoryItemState.SKIPPED;
            historyItem.finished_at = new Date().toISOString();

            this.log(`Cannot run on ${repository.fullRepositoryName()}`);
            this.log('Done.');
            return false;
        }

        const params: BoostScriptHandlerParameters = {
            args,
            boost: this,
            currentRun: Object.freeze(Object.assign({}, historyItem)),
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
        let hasError = false;

        await repository.checkout(this.pullRequest.branch);

        try {
            if (existsSync(`${this.path}/init.js`)) {
                const initFn = require(`${this.path}/init.js`).handler;
                await initFn(params);
            }
        } catch (e) {
            this.log(e);
        }

        try {
            await this.runScripts(params);
        } catch (e) {
            hasError = true;
            this.log(e);
        }

        if (!hasError && this.changedFiles.length > 0) {
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
                hasError = true;
                this.log(e.message);
            }
        }

        historyItem.finished_at = new Date().toISOString();
        historyItem.state = hasError ? BoostHistoryItemState.FAILED : BoostHistoryItemState.SUCCEEDED;
        historyItem.pull_request = pr;

        this.log('Done.');
    }

    public async updatePullRequestBranch() {
        if (!this.repository) {
            return;
        }

        const branches = await this.repository.git.branchLocal();

        if (branches.all.includes(this.pullRequest.branch)) {
            let counter = 1;
            let newBranchName = this.pullRequest.branch;

            while (branches.all.includes(newBranchName)) {
                counter++;
                newBranchName = `${this.pullRequest.branch}-${counter}`;
                console.log({ newBranchName });
            }

            this.pullRequest.branch = newBranchName;

            await this.repository.checkout(newBranchName);
        }
    }

    public async runScripts(params: BoostScriptHandlerParameters) {
        if (this.config.scripts.parallel) {
            await Promise.allSettled(this.scripts.map(script => script(params)));
            return;
        }

        for (const script of this.scripts) {
            await script(params);
        }
    }

    public canRunOnRepository(repo: Repository | string) {
        const repoName = typeof repo === 'string' ? repo : repo.fullRepositoryName();

        // get runs for this boost version and for the current repository,
        // but don't include skipped runs or the current run
        const runs = this.history
            .filter(run => run.repository === repoName)
            .filter(run => run.version === this.version && run.run_id !== this.runId)
            .filter(run => run.state !== BoostHistoryItemState.SKIPPED);

        // boost has run too many times
        if (runs.length >= this.repositoryLimits.maxRunsPerVersion) {
            return false;
        }

        // check the time between runs
        for (const item of runs) {
            const runDate = dayjs(item.started_at);
            const diffInMinutes = dayjs().diff(runDate, 'minute');

            // the minimum time between runs has not passed, so don't run again
            if (diffInMinutes < this.repositoryLimits.minutesBetweenRuns) {
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
