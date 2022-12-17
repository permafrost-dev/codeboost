import { AppSettings, loadSettings } from '@/lib/AppSettings';
import { CodeBoost } from '@/lib/CodeBoost';
import { initOctokit } from '@/lib/github';
import { HistoryManager } from '@/lib/HistoryManager';
import { Repository } from '@/lib/Repository';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { userInfo } from 'os';
import { BatchManager } from '@/lib/BatchManager';
import Queue from 'better-queue';
import chalk from 'chalk';
import { Tools } from '@/lib/Tools';

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

        if (!this.historyManager) {
            this.historyManager = new HistoryManager(options.historyFn);
        }

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

        let result = this.configFilename;

        for (const filename of configFilenames) {
            if (existsSync(filename) && filename.endsWith('.js')) {
                result = filename;
            }
        }

        // If the config file is not found in any of the above locations, return the default value
        return result;
    }

    async executeRun(repoName: string, boostName: string, options: Record<string, any>) {
        const homePath = userInfo({ encoding: 'utf8' }).homedir;
        options.historyFn = `${homePath}/.codeboost/history.json`;

        // Set historyFn to empty string if the file does not exist
        if (!existsSync(options.historyFn)) {
            writeFileSync(options.historyFn, JSON.stringify([]));
        }

        const settings = await this.init(options);

        if (options.dryRun) {
            console.log(`${chalk.yellowBright('dry-run mode enabled')}`);
            settings.dry_run = true;
        }

        const runCodeBoost = async (repoName: string) => {
            if (!repoName) {
                return;
            }
            try {
                const codeboost = await this.initCodeBoost(repoName, settings);

                await codeboost.prepareRepository();
                await codeboost.runBoost(boostName, [ '8.2' ]);
            } catch (e: any) {
                console.log(`${chalk.redBright('✗')} error: ${e.message}`);
            }

            this.historyManager.save();
        };

        const complete = { value: false };
        const queue = this.createQueue(runCodeBoost, new Proxy(complete, {}));

        await this.handleQueuedRepos({
            queue, repoName, options, boostName, settings, complete 
        });
    }

    async handleQueuedRepos({
        queue, repoName, options, boostName, settings, complete 
    }: any) {
        if (options.batch) {
            repoName = 'temp/temp';
        }

        const codeboost = await this.initCodeBoost(repoName, settings);
        const batchMgr = new BatchManager(options.batch, codeboost);

        if (!options.batch) {
            batchMgr.insertBatch(repoName);
            options.size = 1;
        }

        const batch = batchMgr.getBatch(boostName, options.size);

        if (batch.length === 0) {
            console.log(`${chalk.redBright('✗')} No repositories found in batch.`);
            return;
        }

        batch.forEach(item => queue.push(item.name));

        while (!complete.value) {
            await new Promise(resolve => setTimeout(resolve, 100));

            if (complete.value) {
                break;
            }
        }
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

    public createQueue(runCodeBoost, complete) {
        const queue = new Queue(
            async (r, cb) => {
                await runCodeBoost(r);
                cb();
            },
            { concurrent: 2, maxRetries: 2, retryDelay: 1000 },
        );

        queue.on('task_finish', function (taskId, result) {
            //console.log(`${chalk.greenBright('✓')} ${taskId} finished`);
        });
        queue.on('empty', () => {
            //console.log('empty');
        });
        queue.on('drain', function () {
            complete.value = true;
        });
        queue.on('task_queued', t => {
            //console.log('task_queued', t);
        });
        queue.on('task_started', t => {
            //console.log('task_started', t);
        });
        queue.on('task_failed', t => {
            //console.log('task_accepted', t);
        });

        return queue;
    }
}
