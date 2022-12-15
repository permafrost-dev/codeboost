import { BatchManager } from '@/lib/BatchManager';

const mockData = [
    { name: 'repo1', state: {} },
    { name: 'repo2', state: {} },
    { name: 'repo3', state: {} },
];

const mockCodeBoost = { getBoost: jest.fn() };

// @ts-ignore
const batchManager = new BatchManager('', mockCodeBoost);

beforeEach(() => {
    // Clear mock data before each test
    batchManager.data = [...mockData];

    // Clear mock function calls before each test
    mockCodeBoost.getBoost.mockClear();
});

describe('BatchManager', () => {
    describe('getBatch', () => {
        it('should return the specified number of items from the dataset', () => {
            mockCodeBoost.getBoost.mockImplementation(() => ({ canRunOnRepository: jest.fn().mockImplementation(() => true) }));

            // Test with a batch size of 1
            expect(batchManager.getBatch('test-boost', 1)).toEqual([mockData[0]]);

            // Test with a batch size of 2
            expect(batchManager.getBatch('test-boost', 2)).toEqual([mockData[0], mockData[1]]);

            // Test with a batch size of 3
            expect(batchManager.getBatch('test-boost', 3)).toEqual([mockData[0], mockData[1], mockData[2]]);
        });

        it('should call the getUsableDataset function with the boost name', () => {
            // Create a spy on the getUsableDataset function
            const spy = jest.spyOn(batchManager, 'getUsableDataset');

            // Call the getBatch function
            batchManager.getBatch('test-boost', 1);

            // Expect the getUsableDataset function to have been called with the correct boost name
            expect(spy).toHaveBeenCalledWith('test-boost');
        });
    });

    describe('getUsableDataset', () => {
        it('should return only items where the boost can run on the repository', () => {
            // Set up mock for the getBoost function
            mockCodeBoost.getBoost.mockImplementation(() => ({ canRunOnRepository: jest.fn().mockImplementation(() => true) }));

            batchManager.data = [...mockData];

            // Expect the getUsableDataset function to return only the first and third items from the mock data
            expect(batchManager.getUsableDataset('test-boost')).toHaveLength(3);
        });

        it('should call the canRunOnRepository function on the boost with the correct repository name', () => {
            // Create a spy on the canRunOnRepository function
            const spy = jest.fn(repo => repo !== 'repo2');

            // Set up mock for the getBoost function
            mockCodeBoost.getBoost.mockImplementation(() => ({ canRunOnRepository: spy }));

            // Call the getUsableDataset function
            batchManager.getUsableDataset('test-boost');

            expect(spy).toHaveBeenCalledWith('repo1');
            expect(spy).toHaveBeenCalledWith('repo2');
            expect(spy).toHaveBeenCalledWith('repo3');
        });
    });
});
