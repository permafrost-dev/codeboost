import { CodeBoost } from '@/lib/CodeBoost';

export class BatchManager {
    public data: any[] = [];

    constructor(public filename: string, public codeboost: CodeBoost) {
        this.data = filename ? require(filename) : [];
    }

    protected getBoost(boostName: string) {
        return this.codeboost.getBoost(boostName);
    }

    public getBatch(boostName: string, size: number) {
        return this.getUsableDataset(boostName).slice(0, size);
    }

    public insertBatch(item: any) {
        this.data.push({ name: item });
    }

    public getUsableDataset(boostName: string) {
        return this.data.filter(repo => this.getBoost(boostName)?.canRunOnRepository(repo.name));
    }
}
