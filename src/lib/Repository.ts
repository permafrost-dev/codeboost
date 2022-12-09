import { parseFullRepositoryName } from '@/lib/stringHelpers';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

export class Repository {
    public name: string;
    public owner: string;
    public path: string;
    protected gitInstance!: SimpleGit;

    public get git() {
        if (this.gitInstance === undefined) {
            this.gitInstance = simpleGit({
                baseDir: this.path,
                binary: 'git',
                maxConcurrentProcesses: 2,
                trimmed: false,
            });
        }
        return this.gitInstance;
    }

    constructor(fullRepositoryName: string, repositoryStoragePath: string) {
        const { owner, name } = parseFullRepositoryName(fullRepositoryName);

        this.name = name;
        this.owner = owner;

        this.path = `${repositoryStoragePath}/${fullRepositoryName}`;
    }

    public async clone() {
        const parentDir = dirname(this.path);

        if (!existsSync(parentDir)) {
            mkdirSync(parentDir, { recursive: true });
        }

        if (!existsSync(this.path)) {
            execSync(`git -C '${parentDir}' clone git@github.com:${this.owner}/${this.name}.git`, { stdio: 'pipe' });
        }
    }

    public async init() {
        //
    }
}
