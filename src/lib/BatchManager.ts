import { CodeBoost } from '@/lib/CodeBoost';

export class BatchManager {
    public data: any[] = [];

    constructor(public filename: string, public codeboost: CodeBoost) {
        if (!filename) {
            this.data = [];
            return;
        }

        this.data = require(`${process.cwd()}/${filename}`);
    }

    protected getBoost(boostName: string) {
        return this.codeboost.getBoost(boostName);
    }

    public getBatch(boostName: string, size: number) {
        return this.getUsableDataset(boostName).slice(0, size);
    }

    public getUsableDataset(boostName: string) {
        return this.data.filter(repo => this.getBoost(boostName)?.canRunOnRepository(repo.name));
    }

    protected getItemState(item: any) {
        return item.state || {};
    }
}
