import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import { dirname } from 'path';

export type OnFileCopiedCallback = (src: string, dest: string) => void;

export class Tools {
    /**
     * This function takes a number of milliseconds and returns a promise that
     * resolves after that many milliseconds have passed.
     *
     * This function is used to create a delay in a program, which can be useful
     * for debugging, or for building a user interface with an animation.
     * @param {number} ms - The number of milliseconds to wait.
     * @returns A promise that resolves after the given number of milliseconds.
     */
    public async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * This function returns true if the file exists, and false if it doesn't
     * @param {string} path - The path to the file you want to check.
     * @returns A boolean value.
     */
    public fileexists(path: string) {
        return existsSync(path);
    }

    /**
     * It reads a file and returns its contents
     * @param {string} path - The path to the file you want to read.
     * @returns The contents of the file at the given path.
     */
    public readfile(path: string) {
        return readFileSync(path, { encoding: 'utf8' });
    }

    /**
     * Write the given content to the given file path.
     * @param {string} path - The path to the file you want to write to.
     * @param {string} content - The content to write to the file.
     */
    public writefile(path: string, content: string) {
        writeFileSync(path, content, { encoding: 'utf8' });
    }

    /**
     * Copies a file from `src` to `dest`. Both `src` and `dest` should be absolute paths.
     * @param {string} src
     * @param {string} dest
     */
    public copyfile(src: string, dest: string) {
        if (!existsSync(dirname(dest))) {
            mkdirSync(dirname(dest), { recursive: true });
        }

        copyFileSync(src, dest);
    }

    /**
     * It takes a file path and returns the sha-256 hash of the file contents.
     * @param {string} path - The path to the file you want to hash.
     * @returns {string} The sha-256 hash of the file.
     */
    public hashfile(path: string) {
        return this.hashstring(this.readfile(path));
    }

    /**
     * It takes a string and returns the sha-256 hash.
     * @param {string} str - The string you want to hash.
     * @returns {string} The sha-256 hash of the string.
     */
    public hashstring(str: string) {
        return createHash('sha256').update(str)
            .digest('hex')
            .toLowerCase();
    }

    /**
     * This function returns true if the two files have the exact same contents
     * @param {string}
     * @param {string}.
     */
    public filesAreEqual(file1: string, file2: string) {
        if (!this.fileexists(file1) || !this.fileexists(file2)) {
            return false;
        }

        return this.hashfile(file1) === this.hashfile(file2);
    }

    /**
     * It reads a yaml file and returns the contents as an object.
     * @param {string} path - The path to the file you want to read.
     * @returns {object}
     */
    public readYaml(path: string) {
        return yaml.load(this.readfile(path));
    }

    /**
     * It dumps an object to yaml and saves it to the given path.
     * @param {string} path - The path to the file you want to write to.
     * @param {any} data
     */
    public writeYaml(path: string, data: any) {
        this.writefile(path, yaml.dump(data));
    }

    /**
     * It reads a json file and returns the parsed contents as an object.
     * @param {string} path - The path to the file you want to read.
     * @returns {object}
     */
    public readJson(path: string) {
        return JSON.parse(this.readfile(path));
    }

    /**
     * It writes a JSON file to the specified path.
     * @param {string} path - The path to the file you want to write to.
     * @param {any} data - The content to write to the file.
     */
    public writeJson(path: string, data: any) {
        this.writefile(path, JSON.stringify(data, null, 4));
    }

    /**
     * It executes a command and returns the output as a string
     * @param {string} command - The command to execute.
     * @param [silent=true] - If true, the command will not be printed to stdout.
     * @returns {string} The output of the command.
     */
    public exec(command: string, silent = true) {
        return execSync(command, { stdio: silent ? 'pipe' : 'inherit' }).toString();
    }

    /**
     * A function that recursively copies a files from one directory to another. Files that already exist
     * at the destination are overwritten, and directories that do not exist are created.
     *
     * Returns a list of filenames that were copied.
     *
     * @param {string} src - The source directory.
     * @param {string} dest - The destination directory.
     * @param {function|null} onCopiedCallback - A callback function that is called after each file is copied.
     * @returns {string[]}
     */
    public recursiveDirectoryCopy(src: string, dest: string, onCopiedCallback: OnFileCopiedCallback | null = null) {
        const destFiles: string[] = [];
        const handler = (src, dest) => {
            const files = readdirSync(src);

            files
                .filter(file => file !== '.' && file !== '..')
                .forEach(file => {
                    const srcFn = src + '/' + file;
                    const destFn = dest + '/' + file;

                    const stats = lstatSync(srcFn, { throwIfNoEntry: false }) || null;

                    if (stats === null) {
                        return;
                    }

                    if (stats?.isFile() && !this.filesAreEqual(srcFn, destFn)) {
                        copyFileSync(srcFn, destFn);
                        destFiles.push(destFn);

                        if (onCopiedCallback) {
                            onCopiedCallback(srcFn, destFn);
                        }
                    }

                    if (stats?.isDirectory()) {
                        if (!this.fileexists(destFn)) {
                            mkdirSync(destFn);
                        }
                        handler(srcFn, destFn);
                    }
                });
            return destFiles;
        };

        return handler(src, dest);
    }
}
