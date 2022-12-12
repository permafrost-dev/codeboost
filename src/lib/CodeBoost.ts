import { AppSettings } from '@/lib/AppSettings';
import { Boost } from '@/lib/Boost';
import { createOctokit } from '@/lib/github';
import { HistoryManager } from '@/lib/HistoryManager';
import { Repository } from '@/lib/Repository';
import { HasLogger } from '@/traits/HasLogger';
import { BoostConfiguration } from '@/types/BoostConfiguration';
import { Octokit } from '@octokit/core';
import { existsSync } from 'fs';
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import { Mixin } from 'ts-mixer';

export class CodeBoost extends Mixin(HasLogger) {
    protected repository!: Repository;
    protected repositoryDir: string = '';
    protected gitInstance!: SimpleGit;
    public octokit!: Octokit;
    public appSettings!: AppSettings;
    public historyManager!: HistoryManager;
    public repositoryPrepared = false;

    constructor(historyManager: HistoryManager) {
        super();
        this.createLogger({});
        this.historyManager = historyManager;
    }

    public get git() {
        if (!this.gitInstance) {
            this.initGit();
        }

        return this.gitInstance;
    }

    public get repositoryPath() {
        return this.repositoryDir;
    }

    public set repositoryPath(value: string) {
        this.repositoryDir = value;

        if (existsSync(value)) {
            this.initGit();
        }
    }

    /**
     * Initializes a git instance, should be called once the repository path is set
     * to a path that exists. Called automatically when setting the repository path.
     */
    public initGit() {
        const createSimpleGitOptions = (): Partial<SimpleGitOptions> => ({
            baseDir: this.repositoryPath,
            binary: 'git',
            maxConcurrentProcesses: 2,
            trimmed: false,
        });

        this.gitInstance = simpleGit(createSimpleGitOptions());
    }

    public async init(repository: Repository, appSettings: AppSettings) {
        this.appSettings = appSettings;
        this.repository = repository;
        this.repositoryPath = repository.path;
        this.octokit = createOctokit();
    }

    public async prepareRepository() {
        if (this.repositoryPrepared) {
            return;
        }

        await this.repository?.clone();

        if (this.appSettings.use_forks) {
            await this.repository?.createFork();
        }

        this.repositoryPrepared = true;
    }

    public loadBoostConfiguration(id: string) {
        const config = require(`${__dirname}/boosts/${id}/boost.js`).default;

        return <BoostConfiguration>config;
    }

    public async runBoost(id: string, args: string[]) {
        const config = this.loadBoostConfiguration(id);
        const boost = new Boost(this, `${__dirname}/boosts/${config.id}`, config);

        await boost.run(this.repository, args);
    }
}
