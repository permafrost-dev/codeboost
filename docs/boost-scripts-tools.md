---
title: Boost Scripts - Tools
description: Script Tools Reference
---

# Tools Reference

The `tools` object is available to all boost scripts. It contains a collection of utility functions that can be used to perform common tasks.

-   `copyfile(src: string, dest: string): void;`
-   `exec(command: string, silent?: boolean): string;`
-   `fileexists(path: string): boolean;`
-   `filesAreEqual(file1: string, file2: string): boolean;`
-   `hashfile(path: string): string;`
-   `hashstring(str: string): string;`
-   `readJson(path: string): any;`
-   `readYaml(path: string): any;`
-   `readfile(path: string): string;`
-   `recursiveDirectoryCopy(src: string, dest: string, onCopiedCallback?: OnFileCopiedCallback | null): string[];`
-   `sleep(ms: number): Promise<unknown>;`
-   `writeJson(path: string, data: any): void;`
-   `writeYaml(path: string, data: any): void;`
-   `writefile(path: string, content: string): void;`
