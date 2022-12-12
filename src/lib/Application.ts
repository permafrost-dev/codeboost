import { AppSettings, loadSettings } from '@/lib/AppSettings';
import { CodeBoost } from '@/lib/CodeBoost';
import { initOctokit } from '@/lib/github';
import { HistoryManager } from '@/lib/HistoryManager';
import { Repository } from '@/lib/Repository';

export class Application {
    public settings!: AppSettings;
    public codeboost!: CodeBoost;
    public repositoryName!: string;
    public historyManager!: HistoryManager;

    constructor() {
        this.historyManager = new HistoryManager(`${__dirname}/history.json`);
    }

    async init(boostId: string) {
        this.settings = loadSettings(`${__dirname}/settings.js`);
        initOctokit(this.settings.github_token);

        const repo = new Repository(this.repositoryName, this.settings.repository_storage_path);

        await repo.clone();

        if (this.settings.use_forks) {
            await repo.createFork();
        }

        this.codeboost = new CodeBoost(this.historyManager);
        await this.codeboost.init(boostId, ['8.2'], repo, this.settings);
    }

    async execute(repoName: string, boostName: string) {
        this.repositoryName = repoName;
        await this.init(boostName);
        this.historyManager.save();
    }
}
