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

    constructor(public configFilename?: string) {
        this.historyManager = new HistoryManager(`${__dirname}/history.json`);
    }

    async init() {
        this.configFilename = process.cwd() + '/' + this.configFilename ?? `${__dirname}/settings.js`;
        this.settings = loadSettings(this.configFilename);
        initOctokit(this.settings.github_token);

        const repo = new Repository(this.repositoryName, this.settings.repository_storage_path);

        this.codeboost = new CodeBoost(this.settings, this.historyManager);
        await this.codeboost.init(repo, this.settings);
    }

    async execute(repoName: string, boostName: string) {
        this.repositoryName = repoName;

        await this.init();

        try {
            await this.codeboost.prepareRepository();
            await this.codeboost.runBoost(boostName, [ '8.2' ]);
        } catch (e: any) {
            console.log(`error: ${e.message}`);
        }

        this.historyManager.save();
    }
}
