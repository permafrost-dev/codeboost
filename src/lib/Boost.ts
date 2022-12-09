import { Repository } from '@/lib/Repository';
import { BoostConfiguration } from '@/types/BoostConfiguration';
import { existsSync } from 'fs';
import { SimpleGit } from 'simple-git';

export interface BoostScriptHandlerParameters {
    boost: Boost;
    repository: Repository;
    git: SimpleGit;
}

export type BoostScriptHandler = (params: BoostScriptHandlerParameters) => any;

export class Boost {
    protected config!: BoostConfiguration;

    public path!: string;
    public id!: string;
    public version!: string;
    public repositoryLimits!: {
        maxRunsPerVersion: number;
        minutesBetweenRuns: number;
    };
    public pullRequest!: {
        title: string;
        body: string;
        branch: string;
    };
    public scripts!: any[];
    public actions!: any[];

    constructor(path: string, config: BoostConfiguration) {
        this.path = `${path}/${config.version}`;
        this.id = config.id;
        this.version = config.version;
        this.repositoryLimits = {
            maxRunsPerVersion: config.repository_limits.max_runs_per_version,
            minutesBetweenRuns: config.repository_limits.minutes_between_runs,
        };
        this.pullRequest = config.pull_request;
        this.scripts = this.loadScripts(config.scripts.files);
        this.actions = config.actions;

        this.config = Object.assign({}, config);
    }

    public loadScripts(scripts: string[]) {
        const result: any[] = [];

        for (const script of scripts) {
            const fn = `${this.path}/${script}`;

            if (!existsSync(fn)) {
                throw new Error(`Boost script not found: ${fn}`);
            }

            result.push(require(fn).handler);
        }

        return result;
    }

    public async run(repository: Repository) {
        const params: BoostScriptHandlerParameters = {
            boost: this,
            repository,
            git: repository.git,
        };

        if (!this.config.scripts.parallel) {
            for (const script of this.scripts) {
                await script(params);
            }
            return;
        }

        await Promise.all(this.scripts.map(script => script(params)));
    }
}
