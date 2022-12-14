import { AppSettings } from '@/lib/AppSettings';
import { Boost } from '@/lib/Boost';
import { BoostConfiguration } from '@/types/BoostConfiguration';
import { HasLogger, LogTarget } from '@/traits/HasLogger';
import { HistoryManager } from '@/lib/HistoryManager';
import { Repository } from '@/lib/Repository';
import { Mixin } from 'ts-mixer';

export class CodeBoost extends Mixin(HasLogger) {
    protected repository!: Repository;
    public appSettings!: AppSettings;
    public historyManager!: HistoryManager;
    public repositoryPrepared = false;

    constructor(historyManager: HistoryManager) {
        super();
        this.createLogger(<LogTarget[]>this.appSettings?.log_target ?? [], {});
        this.historyManager = historyManager;
    }

    public async init(repository: Repository, appSettings: AppSettings) {
        this.appSettings = appSettings;
        this.repository = repository;
    }

    public async prepareRepository() {
        if (this.repositoryPrepared) {
            return;
        }

        await this.repository?.clone();
        await this.repository?.prepare();

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

        return boost;
    }
}
