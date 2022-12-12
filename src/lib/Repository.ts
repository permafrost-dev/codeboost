import { createOctokit, Github } from '@/lib/github';
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

    /**
     * Checks out the default branch and pulls down the latest changes
     */
    public async prepare() {
        await this.checkout(await this.defaultBranch());
        await this.git.pull('origin');
    }

    public async currentBranch() {
        return (await this.git.branchLocal()).current;
    }

    public async onBranch(branchName: string) {
        return (await this.currentBranch()) === branchName;
    }

    public async checkout(branchName: string) {
        if (!(await this.onBranch(branchName))) {
            await this.git.checkoutLocalBranch(branchName);
        }
    }

    public async defaultBranch() {
        const result = await this.git.revparse('--abbrev-ref', [ 'origin/HEAD' ]);
        return result.replace(/^.+\//, '');
    }

    public async createFork() {
        const octokit = createOctokit();

        try {
            const result = await Github.forkRepository(this, octokit);
            this.git.addRemote('fork', result.ssh_url);
            return;
        } catch (e) {
            console.error(e);
        }

        try {
            const result = await Github.getRepository(this, octokit);
            this.git.addRemote('fork', result.ssh_url);
        } catch (e) {
            console.error(e);
        }
    }

    async pushToFork(branchName: string) {
        await this.git.push('fork', branchName);
    }

    fullRepositoryName() {
        return `${this.owner}/${this.name}`;
    }
}
