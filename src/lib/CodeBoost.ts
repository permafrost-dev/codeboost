import { AppSettings } from '@/lib/AppSettings';
import { Boost } from '@/lib/Boost';
import { createOctokit } from '@/lib/github';
import { Repository } from '@/lib/Repository';
import { BoostConfiguration } from '@/types/BoostConfiguration';
import { Octokit } from '@octokit/core';
import { existsSync } from 'fs';
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';

export class CodeBoost {
    protected repository!: Repository;
    protected repositoryDir: string = '';
    protected gitInstance!: SimpleGit;
    public octokit!: Octokit;
    public appSettings!: AppSettings;

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

        const bc = this.loadBoostConfiguration('php-support');
        const boost = new Boost(`${__dirname}/boosts/${bc.id}`, bc, appSettings);

        console.log({ bc, boost });

        await boost.run(repository, [ '8.2' ]);
    }

    public loadBoostConfiguration(id: string) {
        const config = require(`${__dirname}/boosts/${id}/boost.js`).default;

        return <BoostConfiguration>config;
    }
}
