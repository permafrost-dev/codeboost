import { Boost } from '@/lib/Boost';

export class BatchManager {
    public data: any[] = [];

    constructor(public filename: string) {
        this.data = require(`${process.cwd()}/${filename}`);
    }

    public getBatch(boost: Boost, size: number) {
        return this.getUsableDataset(boost).slice(0, size);
    }

    protected getUsableDataset(boost: Boost) {
        return this.data.filter(repo => boost.canRunOnRepository(repo.name) || true);
    }

    protected getItemState(item: any) {
        return item.state || {};
    }
}
