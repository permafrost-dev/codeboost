export interface BoostConfiguration {
    id: string;
    version: string;
    repository_limits: {
        max_runs_per_version: number;
        minutes_between_runs: number;
    };
    pull_request: {
        title: string;
        body: string;
        branch: string;
    };
    scripts: {
        parallel: boolean;
        files: string[];
    };
    actions: any[];
}
