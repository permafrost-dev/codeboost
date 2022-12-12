import { BoostHistory, BoostHistoryItem } from '@/types/BoostHistory';
import { existsSync, readFileSync, writeFileSync } from 'fs';

export class HistoryManager {
    public data: BoostHistory = [];

    constructor(public filename: string) {
        this.load();
    }

    public for(boostName: string): BoostHistory {
        return this.data.filter(item => item.boost === boostName);
    }

    public createEntry(item: BoostHistoryItem): BoostHistoryItem {
        this.data.push(item);

        return new Proxy(this.data[this.data.length - 1], {} as any);
    }

    public save() {
        writeFileSync(this.filename, JSON.stringify(this.data), { encoding: 'utf8' });
    }

    public load() {
        if (!existsSync(this.filename)) {
            this.save();
        }

        this.data = JSON.parse(readFileSync(this.filename, { encoding: 'utf8' }));
    }
}
