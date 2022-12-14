import { AppSettings, loadSettings } from '@/lib/AppSettings';
import { CodeBoost } from '@/lib/CodeBoost';
import { initOctokit } from '@/lib/github';
import { HistoryManager } from '@/lib/HistoryManager';
import { Repository } from '@/lib/Repository';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { userInfo } from 'os';
import chalk from 'chalk';

export class Application {
    public settings!: AppSettings;
    public codeboost!: CodeBoost;
    public repositoryName!: string;
    public historyManager!: HistoryManager;

    constructor(public configFilename?: string, public specifiedConfigFilename = false) {
        if (!configFilename) {
            this.configFilename = 'codeboost.config.js';
        }
    }

    async init() {
        this.configFilename = this.getConfigFilename() ?? '';

        if (!this.configFilename) {
            console.log(`${chalk.redBright('✗')} No config file found. Please run '${chalk.cyanBright('codeboost init')}'.`);
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }

        this.settings = loadSettings(this.configFilename);
        initOctokit(this.settings.github_token);

        const repo = new Repository(this.repositoryName, this.settings.repository_storage_path);

        this.codeboost = new CodeBoost(this.settings, this.historyManager);
        await this.codeboost.init(repo, this.settings);
    }

    getConfigFilename() {
        if (this.specifiedConfigFilename) {
            return this.configFilename;
        }

        const files = [
            userInfo({ encoding: 'utf8' }).homedir + '/.codeboost/codeboost.config.js',
            userInfo({ encoding: 'utf8' }).homedir + '/codeboost.config.js',
            process.cwd() + '/codeboost.config.js',
            process.cwd() + '/' + this.configFilename,
        ];

        let result = this.configFilename;

        for (const file of files) {
            if (existsSync(file) && file.endsWith('.js')) {
                result = file;
            }
        }

        return result;
    }

    async executeRun(repoName: string, boostName: string) {
        const homePath = userInfo({ encoding: 'utf8' }).homedir;
        let historyFn = `${homePath}/.codeboost/history.json`;

        if (!existsSync(historyFn)) {
            historyFn = '';
        }

        this.historyManager = new HistoryManager(historyFn);

        this.repositoryName = repoName;

        await this.init();

        try {
            await this.codeboost.prepareRepository();
            await this.codeboost.runBoost(boostName, [ '8.2' ]);
        } catch (e: any) {
            console.log(`${chalk.redBright('✗')} error: ${e.message}`);
        }

        this.historyManager.save();
    }

    async executeInit() {
        const homePath = userInfo({ encoding: 'utf8' }).homedir;
        let configFn = `${homePath}/.codeboost/codeboost.config.js`;

        if (this.specifiedConfigFilename) {
            configFn = this.configFilename ?? '';
        }

        if (!existsSync(`${homePath}/.codeboost`)) {
            mkdirSync(`${homePath}/.codeboost`);
            console.log(`${chalk.greenBright('✓')} config directory created`);
        }

        if (!existsSync(configFn)) {
            writeFileSync(
                configFn,
                `
            module.exports.default = {
                github_token: '$GITHUB_TOKEN',
                repository_storage_path: \`\${__dirname}/repositories\`,
                boosts_path: \`\${__dirname}/boosts\`,
                use_forks: true,
                use_pull_requests: true,
                log_target: 'console',
            };`
                    .replaceAll('            ', '')
                    .trim(),
                { encoding: 'utf8' },
            );

            console.log(`${chalk.greenBright('✓')} global config file created`);
        }

        console.log(`${chalk.greenBright('✓')} codeboost initialized`);
    }
}
