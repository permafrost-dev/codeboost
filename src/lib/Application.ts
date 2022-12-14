import { AppSettings, loadSettings } from '@/lib/AppSettings';
import { CodeBoost } from '@/lib/CodeBoost';
import { initOctokit } from '@/lib/github';
import { HistoryManager } from '@/lib/HistoryManager';
import { Repository } from '@/lib/Repository';
import { existsSync } from 'fs';
import { userInfo } from 'os';

export class Application {
    public settings!: AppSettings;
    public codeboost!: CodeBoost;
    public repositoryName!: string;
    public historyManager!: HistoryManager;

    constructor(public configFilename?: string) {
        this.historyManager = new HistoryManager(`${__dirname}/history.json`);
    }

    async init() {
        this.configFilename = this.getConfigFilename() ?? '';
        this.settings = loadSettings(this.configFilename);
        initOctokit(this.settings.github_token);

        const repo = new Repository(this.repositoryName, this.settings.repository_storage_path);

        this.codeboost = new CodeBoost(this.settings, this.historyManager);
        await this.codeboost.init(repo, this.settings);
    }

    getConfigFilename() {
        const files = [
            process.cwd() + '/' + this.configFilename,
            process.cwd() + '/codeboost.config.js',
            userInfo({ encoding: 'utf8' }).homedir + '/codeboost.config.js',
        ];

        for (const file of files) {
            if (existsSync(file) && file.endsWith('.js')) {
                return file;
            }
        }

        return null;
    }

    async execute(repoName: string, boostName: string) {
        this.repositoryName = repoName;

        await this.init();

        try {
            await this.codeboost.prepareRepository();
            await this.codeboost.runBoost(boostName, ['8.2']);
        } catch (e: any) {
            console.log(`error: ${e.message}`);
        }

        this.historyManager.save();
    }
}
