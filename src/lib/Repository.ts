import { eventbus } from '@/lib/EventBus';
import { GIT_FILE_ADDED_EVENT } from '@/lib/Events';
import { createOctokit, Github } from '@/lib/github';
import { parseFullRepositoryName } from '@/lib/stringHelpers';
import { RepositoryInfo } from '@/types/RepositoryInfo';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import simpleGit, { Response, SimpleGit, SimpleGitTaskCallback } from 'simple-git';

export class Repository {
    public name: string;
    public owner: string;
    public path: string;
    public gitInstance!: SimpleGit;

    public get info() {
        return <RepositoryInfo>{
            owner: this.owner,
            name: this.name,
        };
    }

    public get git() {
        if (this.gitInstance === undefined) {
            this.gitInstance = simpleGit({
                baseDir: this.path,
                binary: 'git',
                maxConcurrentProcesses: 3,
                trimmed: false,
            }) as SimpleGit;
        }

        return this.gitInstance;
    }

    public initGitListeners(runId: string) {
        this.gitInstance.add = (files: string | string[], callback?: SimpleGitTaskCallback<string>): Response<string> => {
            eventbus.emit(GIT_FILE_ADDED_EVENT, { repository: this.info, files, runId });
            return this.gitInstance.raw([ 'add', ...[].concat(<any>files) ], callback);
        };
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

        return true;
    }

    /**
     * Checks out the default branch and pulls down the latest changes
     */
    public async prepare() {
        try {
            await this.checkout(await this.defaultBranch());
            await this.git.pull('origin');
        } catch (e) {
            console.log('Error preparing repository: ', e);
        }
    }

    public async localBranches() {
        const result = await this.git.branchLocal();

        return result;
    }

    public async currentBranch() {
        return (await this.localBranches()).current;
    }

    public async onBranch(branchName: string) {
        return (await this.currentBranch()) === branchName;
    }

    public async checkout(branchName: string) {
        const branchList = await this.localBranches();

        if (branchList.current === branchName) {
            return;
        }

        if (branchList.all.includes(branchName)) {
            await this.git.checkout(branchName);
            return;
        }

        await this.git.checkoutLocalBranch(branchName);
    }

    public async defaultBranch() {
        const result = await this.git.revparse('--abbrev-ref', [ 'origin/HEAD' ]);
        return result.replace(/^.+\//, '');
    }

    public async createFork() {
        const octokit = createOctokit();

        try {
            const result = await Github.forkRepository(this.info, octokit);
            this.git.addRemote('fork', result.ssh_url);
            return;
        } catch (e) {
            console.error(e);
        }

        try {
            const result = await Github.getRepository(this.info, octokit);
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
