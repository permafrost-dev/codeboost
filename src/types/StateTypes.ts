import { parseFullRepositoryName } from '@/lib/stringHelpers';
import dayjs from 'dayjs';

export interface IState {
    [key: string]: IStateItem;
}

export interface IStateItem {
    repository?: StateRepository;
    actionRuns: StateActionRun[];
}

export interface StateRepository {
    name: string;
    owner: string;
    fullName: string;
}

export enum StateActionRunStatus {
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    SKIPPED = 'skipped',
    IN_PROGRESS = 'in_progress',
    UNKNOWN = 'unknown',
}

export interface StateActionRun {
    action: string;
    version: string;
    runId: string;
    message: string;
    success: boolean;
    skipped: boolean;
    status?: StateActionRunStatus;
    fileCount: number;
    started_at: string | dayjs.Dayjs;
    completed_at: string | dayjs.Dayjs;
    duration: number;
    pull_request: StatePullRequest[];
    message_log: StateMessageLogItem[];
}

export interface StatePullRequest {
    number: number;
    title: string;
    url: string;
    createdAt: string | dayjs.Dayjs;
    branchName: string;
    state?: string;
    lastCheckedAt?: string | dayjs.Dayjs | null;
}

export interface StateMessageLogItem {
    message: string;
    level: string;
    context: string;
    action: string;
    repository: string;
    runId: string;
}

export function coerceState(state: IState): IState {
    for (const key in state) {
        const item = state[key];

        item.repository =
            item.repository ||
            <StateRepository>{
                ...parseFullRepositoryName(key),
                fullName: key,
            };

        if (!item.actionRuns) {
            item.actionRuns = [];
        }

        const convertToDayJsIfString = (value: string | dayjs.Dayjs | any) => {
            if (typeof value === 'string') {
                return dayjs(value);
            }
            return value;
        };

        item.actionRuns.forEach(run => {
            run.started_at = convertToDayJsIfString(run.started_at);
            run.completed_at = convertToDayJsIfString(run.completed_at);

            if (typeof run.status === 'undefined') {
                run.status = StateActionRunStatus.UNKNOWN;

                if (run.success) {
                    run.status = StateActionRunStatus.SUCCEEDED;
                }

                if (run.skipped) {
                    run.status = StateActionRunStatus.SKIPPED;
                }
            }

            run.pull_request.forEach(pr => {
                pr.createdAt = convertToDayJsIfString(pr.createdAt);

                if (typeof pr.state === 'undefined') {
                    pr.state = 'UNKNOWN';
                }

                if (typeof pr.lastCheckedAt === 'undefined') {
                    pr.lastCheckedAt = null;
                }
            });
        });
    }

    return state;
}
