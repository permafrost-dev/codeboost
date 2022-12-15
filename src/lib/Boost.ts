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
import { Github } from '@/lib/github';

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
    protected repository: Repository | null = null;

    public config!: BoostConfiguration;
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

    constructor(codeBoost: CodeBoost, boostPath: string) {
        this.runId = generateRunId();
        this.config = this.loadConfiguration(boostPath);
        this.codeBoost = codeBoost;
        this.init(boostPath);
    }

    public init(boostPath: string) {
        this.path = `${boostPath}/${this.config.version}`;
        this.id = this.config.id;
        this.version = this.config.version;

        this.repositoryLimits = {
            maxRunsPerVersion: this.config.repository_limits.max_runs_per_version,
            minutesBetweenRuns: this.config.repository_limits.minutes_between_runs,
        };

        this.pullRequest = this.loadPullRequest(this.config.pull_request);
        this.scripts = this.loadScripts(this.config.scripts.files);
    }

    public get appSettings(): AppSettings {
        return this.codeBoost.appSettings;
    }

    public get history(): BoostHistory {
        return this.codeBoost.historyManager.for(this.id);
    }

    public log(message) {
        this.codeBoost.log(message, [{ boost: this.id, run_id: this.runId, repository: this.repository?.fullRepositoryName() }]);
    }

    public loadConfiguration(boostPath: string) {
        const config = require(`${boostPath}/boost.js`).default;

        return <BoostConfiguration>config;
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

        const params = this.createScriptHandlerParameters(args, historyItem);

        const catchErrors = async (callBack: CallableFunction, args: any = []) => {
            try {
                return await callBack(...args);
            } catch (e) {
                console.log('******');
                hasError = true;
                this.log(e);
                return false;
            }
        };

        const handleDryRun = async (callback: CallableFunction, dryRunMessage: string) => {
            if (!this.appSettings.dry_run) {
                return await callback();
            }

            this.log(`[dry run] ${dryRunMessage}`);
            return null;
        };

        let hasError = false;

        if (!this.appSettings.use_pull_requests) {
            this.pullRequest.branch = await repository.defaultBranch();
        }

        if (this.appSettings.use_pull_requests) {
            await this.updatePullRequestBranchName();
            await this.checkoutPullRequestBranch();
        }

        catchErrors(async () => {
            await this.runInitializationScript(params);
            await this.runScripts(params);
        });

        if (!hasError && this.changedFiles.length > 0) {
            catchErrors(async () => {
                const remote = this.appSettings.use_forks ? 'fork' : 'origin';
                handleDryRun(
                    async () => await repository.git.push(remote, this.pullRequest.branch),
                    `push branch ${this.pullRequest.branch} to ${remote}`,
                );
            });

            catchErrors(async () => {
                handleDryRun(async () => {
                    await this.handlePullRequestCreation({ repository, historyItem });
                }, 'create pull request');
            });
        }

        historyItem.finished_at = new Date().toISOString();
        historyItem.state = hasError ? BoostHistoryItemState.FAILED : BoostHistoryItemState.SUCCEEDED;

        this.log('Done.');
    }

    public async handlePullRequestCreation({ repository, historyItem }) {
        if (!this.appSettings.use_pull_requests) {
            return;
        }

        const loadStringOrFile = (value: string) => {
            return existsSync(`${this.path}/${value}`) ? readFileSync(`${this.path}/${value}`, 'utf8') : value;
        };

        const title = await edge.renderRaw(loadStringOrFile(this.pullRequest.title), { boost: this, state: () => this.state });
        const body = await edge.renderRaw(loadStringOrFile(this.pullRequest.body), { boost: this, state: () => this.state });

        const defaultBranch = (await this.repository?.defaultBranch()) ?? 'main';

        const pr: any = await Github.createPullRequest(repository, this.pullRequest.branch, defaultBranch, title.trim(), body.trim());
        historyItem.pull_request = pr?.number;

        if (pr) {
            this.log(`created pull request #${pr.number}`);

            if (this.appSettings.auto_merge_pull_requests) {
                await Github.mergePullRequest(repository, pr.number);
                this.log(`merged pull request #${pr.number}`);
            }
        }
    }

    public createScriptHandlerParameters(args: any[], historyItem: BoostHistoryItem): BoostScriptHandlerParameters {
        return <BoostScriptHandlerParameters>{
            args,
            boost: this,
            currentRun: Object.freeze(Object.assign({}, historyItem)),
            git: this.repository?.git,
            libs: {
                fs: require('fs'),
                path: require('path'),
                semver,
            },
            repository: this.repository,
            tools: new Tools(),
        };
    }

    public async runInitializationScript(params: BoostScriptHandlerParameters) {
        if (existsSync(`${this.path}/init.js`)) {
            const initFn = require(`${this.path}/init.js`).handler;
            await initFn(params);
        }
    }

    public async checkoutPullRequestBranch() {
        await this.repository?.checkout(this.pullRequest.branch);
    }

    /**
     * update to a unique branch name if the branch already exists
     */
    public async updatePullRequestBranchName() {
        if (!this.repository) {
            return false;
        }

        const branches = await this.repository.localBranches();

        if (branches.all.includes(this.pullRequest.branch)) {
            let counter = 1;
            let newBranchName = this.pullRequest.branch;

            while (branches.all.includes(newBranchName)) {
                counter++;
                newBranchName = `${this.pullRequest.branch}-${counter}`;
            }

            this.pullRequest.branch = newBranchName;
        }

        return true;
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

        const runs = this.history
            .filter(run => run.repository === repoName)
            .filter(run => run.version === this.version && run.run_id !== this.runId)
            .filter(run => run.state !== BoostHistoryItemState.SKIPPED);

        if (this.repositoryLimits.maxRunsPerVersion <= runs.length) {
            return false;
        }

        return !this.isRunTimeRestricted(runs);
    }

    protected isRunTimeRestricted(runs: BoostHistoryItem[]): boolean {
        for (const item of runs) {
            const runDate = dayjs(item.started_at);

            if (dayjs().diff(runDate, 'minute') < this.repositoryLimits.minutesBetweenRuns) {
                return true;
            }
        }

        return false;
    }
}
