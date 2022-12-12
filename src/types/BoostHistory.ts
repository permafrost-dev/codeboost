export type BoostHistory = BoostHistoryItem[];

export enum BoostHistoryItemState {
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    RUNNING = 'running',
    SKIPPED = 'skipped',
    UNKNOWN = 'unknown',
}

export interface BoostHistoryItem {
    boost: string;
    version: string;
    repository: string;
    pull_request: number | null;
    state: BoostHistoryItemState;
    started_at: string;
    finished_at: string | null;
    [key: string]: any;
}
