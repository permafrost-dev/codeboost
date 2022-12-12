import { generateRunId } from '@/lib/helpers';
import { HistoryManager } from '@/lib/HistoryManager';
import { BoostHistoryItem, BoostHistoryItemState } from '@/types/BoostHistory';
import dayjs from 'dayjs';

export class FakeHistoryManager extends HistoryManager {
    constructor() {
        super('');
    }

    public addItem(boostName, boostVersion, repositoryName, state: BoostHistoryItemState, ageInMinutes = 1, runId: string | null = null) {
        // random integer between 1 and 10
        const randomInt = Math.floor(Math.random() * 10) + 1;
        const startedAt = dayjs().subtract(ageInMinutes, 'minute');
        const finishedAt = startedAt.add(randomInt, 'second');
        runId = runId ?? generateRunId();

        const data: BoostHistoryItem = {
            run_id: runId,
            boost: boostName,
            version: boostVersion,
            repository: repositoryName,
            pull_request: null,
            state,
            started_at: startedAt.toISOString(),
            finished_at: finishedAt.toISOString(),
        };

        this.data.push(data);
    }

    public addSucceededItem(boostName, boostVersion, repositoryName, ageInMinutes = 1, runId: string | null = null) {
        this.addItem(boostName, boostVersion, repositoryName, BoostHistoryItemState.SUCCEEDED, ageInMinutes, runId);
    }

    public addFailedItem(boostName, boostVersion, repositoryName, ageInMinutes = 1, runId: string | null = null) {
        this.addItem(boostName, boostVersion, repositoryName, BoostHistoryItemState.FAILED, ageInMinutes, runId);
    }

    public addRunningItem(boostName, boostVersion, repositoryName, ageInMinutes = 1, runId: string | null = null) {
        this.addItem(boostName, boostVersion, repositoryName, BoostHistoryItemState.RUNNING, ageInMinutes, runId);
    }

    public addSkippedItem(boostName, boostVersion, repositoryName, ageInMinutes = 1, runId: string | null = null) {
        this.addItem(boostName, boostVersion, repositoryName, BoostHistoryItemState.SKIPPED, ageInMinutes, runId);
    }
}
