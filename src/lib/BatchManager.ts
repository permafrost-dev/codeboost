import { Boost } from '@/lib/Boost';

export class BatchManager {
    public data: any[] = [];

    constructor(public filename: string) {
        this.data = require(filename);
    }

    public getBatch(boost: Boost, size: number) {
        return this.getUsableDataset(boost).slice(0, size);
    }

    protected getUsableDataset(boost: Boost) {
        return this.data.filter(item => boost.canRunOnRepository(item.repository));
    }

    protected getItemState(item: any) {
        return item.state || {};
    }
}
