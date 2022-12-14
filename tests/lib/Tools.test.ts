import { Tools } from '@/lib/Tools';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync } from 'fs';

let tools: Tools;

beforeAll(() => {
    execSync(`rm -rf ${__dirname}/fixtures/temp/test*`);
});

beforeEach(() => {
    tools = new Tools();
});

it('sleeps for 1 second', async () => {
    const start = Date.now();
    await tools.sleep(1000);
    const end = Date.now();

    expect(end - start).toBeGreaterThanOrEqual(950);
});

it('checks if a file exists', () => {
    expect(tools.fileexists(__filename)).toBeTruthy();
    expect(tools.fileexists('non-existent-file')).toBeFalsy();
});

it('reads a file', () => {
    expect(tools.readfile(__filename)).toContain(`it('reads a file', () => {`);
});

it('writes a file', () => {
    const path = `${__dirname}/../fixtures/temp/test.txt`;
    const content = 'Hello, world!';

    tools.writefile(path, content);

    expect(existsSync(path)).toBeTruthy();
    expect(readFileSync(path, 'utf-8')).toBe(content);
});

it('copies a file', () => {
    const src = __filename;
    const dest = `${__dirname}/../fixtures/temp/test.ts`;

    expect(existsSync(dest)).toBeFalsy();

    tools.copyfile(src, dest);

    expect(existsSync(dest)).toBeTruthy();
});

it('hashes a file', () => {
    const path = `${__dirname}/../fixtures/test-boost-1/1.0.0/first.js`;

    expect(tools.hashfile(path)).toBe('ebfa68fa54781a061bc26dde44e10a82df2bc1ded4aff93df82a505f364eb553');
});

it('hashes a string', () => {
    const str = 'test string';

    expect(tools.hashstring(str)).toBe('d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b');
});

it('compares two files', () => {
    const path1 = `${__dirname}/../fixtures/test-boost-1/1.0.0/first.js`;
    const path2 = `${__dirname}/../fixtures/test-boost-1/1.0.0/second.js`;

    expect(tools.filesAreEqual(path1, path2)).toBeTruthy();
});

it('reads a yaml file', () => {
    const path = `${__dirname}/../fixtures/files/test1.yaml`;

    expect(tools.readYaml(path)).toMatchSnapshot();
});

it('reads a json file', () => {
    const path = `${__dirname}/../fixtures/files/test1.json`;

    expect(tools.readJson(path)).toMatchSnapshot();
});

it('copies a directory recursively', () => {
    const src = `${__dirname}/../fixtures/test-boost-1`;
    const dest = `${__dirname}/../fixtures/temp/test-boost-1`;

    mkdirSync(dest, { recursive: true });

    tools.recursiveDirectoryCopy(src, dest);

    expect(existsSync(dest)).toBeTruthy();
    expect(tools.filesAreEqual(`${src}/1.0.0/first.js`, `${dest}/1.0.0/first.js`)).toBeTruthy();
});
