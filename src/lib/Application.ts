import { AppSettings, loadSettings } from '@/lib/AppSettings';
import { CodeBoost } from '@/lib/CodeBoost';
import { initOctokit } from '@/lib/github';
import { Repository } from '@/lib/Repository';

export class Application {
    public settings!: AppSettings;
    public codeboost!: CodeBoost;
    public repositoryName!: string;

    async init() {
        this.settings = loadSettings(`${__dirname}/settings.js`);
        initOctokit(this.settings.github_token);
        const repo = new Repository(this.repositoryName, this.settings.repository_storage_path);

        await repo.clone();

        this.codeboost = new CodeBoost();
        await this.codeboost.init(repo);
    }

    async execute(repoName: string, boostName: string) {
        this.repositoryName = repoName;
        await this.init();

        console.log('execute', repoName, boostName);
        console.log('settings:', this.settings);
    }
}
