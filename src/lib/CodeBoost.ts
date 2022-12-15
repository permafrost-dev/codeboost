import { AppSettings } from '@/lib/AppSettings';
import { Boost } from '@/lib/Boost';
import { HasLogger, LogTarget } from '@/traits/HasLogger';
import { HistoryManager } from '@/lib/HistoryManager';
import { Repository } from '@/lib/Repository';
import { Mixin } from 'ts-mixer';

export class CodeBoost extends Mixin(HasLogger) {
    protected repository!: Repository;
    public appSettings!: AppSettings;
    public historyManager!: HistoryManager;
    public repositoryPrepared = false;

    constructor(appSettings: AppSettings, historyManager: HistoryManager) {
        super();
        this.createLogger(<LogTarget[]>appSettings?.log_target ?? [], {});
        this.appSettings = appSettings;
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

        if (this.appSettings.use_forks && !this.appSettings.dry_run) {
            console.log('creating fork');
            await this.repository?.createFork();
        }

        this.repositoryPrepared = true;
    }

    public async runBoost(boost: string | Boost, args: string[]) {
        boost = typeof boost === 'string' ? this.getBoost(boost) : boost;

        await boost.run(this.repository, args);

        return boost;
    }

    public getBoost(boostName: string) {
        return new Boost(this, `${this.appSettings.boosts_path}/${boostName}`);
    }
}
