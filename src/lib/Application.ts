import { AppSettings, loadSettings } from '@/lib/AppSettings';
import { CodeBoost } from '@/lib/CodeBoost';
import { initOctokit } from '@/lib/github';
import { HistoryManager } from '@/lib/HistoryManager';
import { Repository } from '@/lib/Repository';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { userInfo } from 'os';
import { BatchManager } from '@/lib/BatchManager';
import chalk from 'chalk';

export class Application {
    public settings!: AppSettings;
    public repositoryName!: string;
    public historyManager!: HistoryManager;

    constructor(public configFilename?: string, public specifiedConfigFilename = false) {
        if (!configFilename) {
            this.configFilename = 'codeboost.config.js';
        }
    }

    async init(options: Record<string, any> = {}) {
        this.configFilename = this.getConfigFilename() ?? '';

        if (!this.configFilename) {
            console.log(`${chalk.redBright('✗')} No config file found. Please run '${chalk.cyanBright('codeboost init')}'.`);
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }

        const settings = loadSettings(this.configFilename);

        if (typeof options.dryRun === 'boolean') {
            settings.dry_run = options.dryRun;
        }

        initOctokit(settings.github_token);

        this.historyManager = new HistoryManager(options.historyFn);

        return settings;
    }

    public async initCodeBoost(repoName: string, settings: AppSettings) {
        const repo = new Repository(repoName, settings.repository_storage_path);

        const codeboost = new CodeBoost(settings, this.historyManager);
        await codeboost.init(repo, settings);

        return codeboost;
    }

    public getConfigFilename(homePath: string | null = null) {
        homePath = homePath ?? userInfo({ encoding: 'utf8' }).homedir;
        const cwd = process.cwd();

        // Use specified config filename if provided
        if (this.specifiedConfigFilename) {
            return this.configFilename;
        }

        // Otherwise, try to find the config file in the following locations, in order:
        const configFilenames = [
            `${homePath}/.codeboost/codeboost.config.js`,
            `${homePath}/codeboost.config.js`,
            `${cwd}/codeboost.config.js`,
            `${cwd}/${this.configFilename}`,
        ];

        console.log(configFilenames);

        for (const filename of configFilenames) {
            if (existsSync(filename) && filename.endsWith('.js')) {
                return filename;
            }
        }

        // If the config file is not found in any of the above locations, return the default value
        return this.configFilename;
    }

    async executeRun(repoName: string, boostName: string, options: Record<string, any>) {
        const homePath = userInfo({ encoding: 'utf8' }).homedir;
        options.historyFn = `${homePath}/.codeboost/history.json`;

        // Set historyFn to empty string if the file does not exist
        if (!existsSync(options.historyFn)) {
            options.historyFn = '';
        }

        const settings = await this.init(options);

        // Define a helper function to run codeboost on a repository
        const runCodeBoost = async (repoName: string) => {
            try {
                const codeboost = await this.initCodeBoost(repoName, settings);

                await codeboost.prepareRepository();
                await codeboost.runBoost(boostName, [ '8.2' ]);
            } catch (e: any) {
                console.log(`${chalk.redBright('✗')} error: ${e.message}`);
            }

            this.historyManager.save();
        };

        // If options.batch is not set, run codeboost on the provided repository
        if (!options.batch) {
            return await runCodeBoost(repoName);
        }

        // Otherwise, run codeboost on each item in the batch
        const codeboost = await this.initCodeBoost(repoName, settings);
        const batchMgr = new BatchManager(options.batch, codeboost);
        const batch = batchMgr.getBatch(boostName, options.size);

        await Promise.allSettled(batch.map(item => runCodeBoost(item.name)));
    }

    async executeInit(homePath: string | null = null) {
        homePath = homePath ?? userInfo({ encoding: 'utf8' }).homedir;
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
