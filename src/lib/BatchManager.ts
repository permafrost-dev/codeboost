import { Boost } from '@/lib/Boost';
import { CodeBoost } from '@/lib/CodeBoost';

export class BatchManager {
    public data: any[] = [];

    constructor(public filename: string, protected codeboost: CodeBoost) {
        this.data = require(`${process.cwd()}/${filename}`);
    }

    protected getBoost(boostName: string) {
        return this.codeboost.getBoost(boostName);
    }

    public getBatch(boostName: string, size: number) {
        return this.getUsableDataset(boostName).slice(0, size);
    }

    protected getUsableDataset(boostName: string) {
        return this.data.filter(repo => this.getBoost(boostName).canRunOnRepository(repo.name) || true);
    }

    protected getItemState(item: any) {
        return item.state || {};
    }
}
