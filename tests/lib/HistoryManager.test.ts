import { HistoryManager } from '@/lib/HistoryManager';
import { existsSync, unlinkSync } from 'fs';

it('loads run history from file', () => {
    const historyManager = new HistoryManager(`${__dirname}/../fixtures/history.json`);

    expect(historyManager.data).toHaveLength(2);
});

it('saves to a new file if it does not exist', () => {
    const filename = `${__dirname}/../fixtures/temp/history.json`;
    if (existsSync(filename)) {
        unlinkSync(filename);
    }

    const historyManager = new HistoryManager(filename);

    expect(historyManager).toHaveLength(0);
    expect(existsSync(filename)).toBeTruthy();
});
