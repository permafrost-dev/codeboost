import { AppSettings, loadSettings } from '@/lib/AppSettings';
import { CodeBoost } from '@/lib/CodeBoost';
import { initOctokit } from '@/lib/github';
import { HistoryManager } from '@/lib/HistoryManager';
import { Repository } from '@/lib/Repository';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { userInfo } from 'os';
import chalk from 'chalk';
import { BatchManager } from '@/lib/BatchManager';

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

    async init(repoName: string, options: Record<string, any> = {}) {
        this.configFilename = this.getConfigFilename() ?? '';

        if (!this.configFilename) {
            console.log(`${chalk.redBright('✗')} No config file found. Please run '${chalk.cyanBright('codeboost init')}'.`);
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }

        this.settings = loadSettings(this.configFilename);

        if (typeof options.dryRun === 'boolean') {
            this.settings.dry_run = options.dryRun;
        }

        initOctokit(this.settings.github_token);
    }

    public async initCodeBoost(repoName: string) {
        const repo = new Repository(repoName, this.settings.repository_storage_path);

        const codeboost = new CodeBoost(this.settings, this.historyManager);
        await codeboost.init(repo, this.settings);
        this.codeboost = codeboost;

        return codeboost;
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

    async executeRun(repoName: string, boostName: string, options: Record<string, any>) {
        const homePath = userInfo({ encoding: 'utf8' }).homedir;
        let historyFn = `${homePath}/.codeboost/history.json`;

        if (!existsSync(historyFn)) {
            historyFn = '';
        }

        this.historyManager = new HistoryManager(historyFn);
        await this.init(repoName, options);

        const execute = async repoName => {
            try {
                const codeboost = await this.initCodeBoost(repoName);

                await codeboost.prepareRepository();
                await codeboost.runBoost(boostName, [ '8.2' ]);
            } catch (e: any) {
                console.log(`${chalk.redBright('✗')} error: ${e.message}`);
            }

            this.historyManager.save();
        };

        if (!options.batch) {
            return await execute(repoName);
        }

        const codeboost = await this.initCodeBoost(repoName);

        const batchMgr = new BatchManager(options.batch);
        const boost = codeboost.getBoost(boostName);

        await Promise.allSettled(batchMgr.getBatch(boost, options.size).map(item => execute(item.name)));
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
