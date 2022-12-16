import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { Repository } from '@/lib/Repository';
import { dirname } from 'path';

jest.mock('child_process');
jest.mock('fs');

beforeEach(() => {
    jest.resetAllMocks();
});

describe('clone', () => {
    let repository: Repository;

    beforeEach(() => {
        repository = new Repository('owner/name', `${__dirname}/../../fixtures/temp`);
    });

    it('should create the parent directory if it does not exist', async () => {
        (existsSync as jest.Mock).mockReturnValue(false);

        await repository.clone();

        expect(mkdirSync).toHaveBeenCalledWith(dirname(repository.path), { recursive: true });
    });

    it('should not create the parent directory if it already exists', async () => {
        (existsSync as jest.Mock).mockReturnValue(true);

        await repository.clone();

        expect(mkdirSync).not.toHaveBeenCalled();
    });

    it('should clone the repository if it does not exist', async () => {
        (existsSync as jest.Mock).mockReturnValue(false);

        await repository.clone();

        expect(execSync).toHaveBeenCalledWith(`git -C '${dirname(repository.path)}' clone git@github.com:${repository.owner}/${repository.name}.git`, {stdio: 'pipe',});
    });

    it('should not clone the repository if it already exists', async () => {
        (existsSync as jest.Mock).mockReturnValue(true);

        await repository.clone();

        expect(execSync).not.toHaveBeenCalled();
    });

    it('should return true', async () => {
        const result = await repository.clone();

        expect(result).toBe(true);
    });
});
