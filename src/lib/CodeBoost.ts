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

        if (this.appSettings.use_forks) {
            await this.repository?.createFork();
        }

        this.repositoryPrepared = true;
    }

    public async runBoost(id: string, args: string[]) {
        const boost = new Boost(this, `${this.appSettings.boosts_path}/${id}`);
        await boost.run(this.repository, args);

        return boost;
    }
}
