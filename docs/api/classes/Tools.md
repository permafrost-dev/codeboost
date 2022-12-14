[codeboost](../README.md) / [Exports](../modules.md) / Tools

# Class: Tools

## Table of contents

### Constructors

-   [constructor](Tools.md#constructor)

### Methods

-   [copyfile](Tools.md#copyfile)
-   [exec](Tools.md#exec)
-   [fileexists](Tools.md#fileexists)
-   [filesAreEqual](Tools.md#filesareequal)
-   [hashfile](Tools.md#hashfile)
-   [hashstring](Tools.md#hashstring)
-   [readJson](Tools.md#readjson)
-   [readYaml](Tools.md#readyaml)
-   [readfile](Tools.md#readfile)
-   [recursiveDirectoryCopy](Tools.md#recursivedirectorycopy)
-   [sleep](Tools.md#sleep)
-   [writeJson](Tools.md#writejson)
-   [writeYaml](Tools.md#writeyaml)
-   [writefile](Tools.md#writefile)

## Constructors

### constructor

• **new Tools**()

## Methods

### copyfile

▸ **copyfile**(`src`, `dest`): `void`

Copies a file from `src` to `dest`. Both `src` and `dest` should be absolute paths.

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `src`  | `string` |
| `dest` | `string` |

#### Returns

`void`

---

### exec

▸ **exec**(`command`, `silent?`): `string`

It executes a command and returns the output as a string

#### Parameters

| Name      | Type      | Default value | Description                                         |
| :-------- | :-------- | :------------ | :-------------------------------------------------- |
| `command` | `string`  | `undefined`   | The command to execute.                             |
| `silent?` | `boolean` | `true`        | If true, the command will not be printed to stdout. |

#### Returns

`string`

The output of the command.

---

### fileexists

▸ **fileexists**(`path`): `boolean`

This function returns true if the file exists, and false if it doesn't

#### Parameters

| Name   | Type     | Description                             |
| :----- | :------- | :-------------------------------------- |
| `path` | `string` | The path to the file you want to check. |

#### Returns

`boolean`

A boolean value.

---

### filesAreEqual

▸ **filesAreEqual**(`file1`, `file2`): `boolean`

This function returns true if the two files have the exact same contents

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `file1` | `string` |
| `file2` | `string` |

#### Returns

`boolean`

---

### hashfile

▸ **hashfile**(`path`): `string`

It takes a file path and returns the sha-256 hash of the file contents.

#### Parameters

| Name   | Type     | Description                            |
| :----- | :------- | :------------------------------------- |
| `path` | `string` | The path to the file you want to hash. |

#### Returns

`string`

The sha-256 hash of the file.

---

### hashstring

▸ **hashstring**(`str`): `string`

It takes a string and returns the sha-256 hash.

#### Parameters

| Name  | Type     | Description                  |
| :---- | :------- | :--------------------------- |
| `str` | `string` | The string you want to hash. |

#### Returns

`string`

The sha-256 hash of the string.

---

### readJson

▸ **readJson**(`path`): `any`

It reads a json file and returns the parsed contents as an object.

#### Parameters

| Name   | Type     | Description                            |
| :----- | :------- | :------------------------------------- |
| `path` | `string` | The path to the file you want to read. |

#### Returns

`any`

---

### readYaml

▸ **readYaml**(`path`): `any`

It reads a yaml file and returns the contents as an object.

#### Parameters

| Name   | Type     | Description                            |
| :----- | :------- | :------------------------------------- |
| `path` | `string` | The path to the file you want to read. |

#### Returns

`any`

---

### readfile

▸ **readfile**(`path`): `string`

It reads a file and returns its contents

#### Parameters

| Name   | Type     | Description                            |
| :----- | :------- | :------------------------------------- |
| `path` | `string` | The path to the file you want to read. |

#### Returns

`string`

The contents of the file at the given path.

---

### recursiveDirectoryCopy

▸ **recursiveDirectoryCopy**(`src`, `dest`, `onCopiedCallback?`): `string`[]

A function that recursively copies a files from one directory to another. Files that already exist
at the destination are overwritten, and directories that do not exist are created.

Returns a list of filenames that were copied.

#### Parameters

| Name               | Type                                                                   | Default value | Description                                                   |
| :----------------- | :--------------------------------------------------------------------- | :------------ | :------------------------------------------------------------ |
| `src`              | `string`                                                               | `undefined`   | The source directory.                                         |
| `dest`             | `string`                                                               | `undefined`   | The destination directory.                                    |
| `onCopiedCallback` | `null` \| [`OnFileCopiedCallback`](../modules.md#onfilecopiedcallback) | `null`        | A callback function that is called after each file is copied. |

#### Returns

`string`[]

---

### sleep

▸ **sleep**(`ms`): `Promise`<`unknown`\>

This function takes a number of milliseconds and returns a promise that
resolves after that many milliseconds have passed.

This function is used to create a delay in a program, which can be useful
for debugging, or for building a user interface with an animation.

#### Parameters

| Name | Type     | Description                         |
| :--- | :------- | :---------------------------------- |
| `ms` | `number` | The number of milliseconds to wait. |

#### Returns

`Promise`<`unknown`\>

A promise that resolves after the given number of milliseconds.

---

### writeJson

▸ **writeJson**(`path`, `data`): `void`

It writes a JSON file to the specified path.

#### Parameters

| Name   | Type     | Description                                |
| :----- | :------- | :----------------------------------------- |
| `path` | `string` | The path to the file you want to write to. |
| `data` | `any`    | The content to write to the file.          |

#### Returns

`void`

---

### writeYaml

▸ **writeYaml**(`path`, `data`): `void`

It dumps an object to yaml and saves it to the given path.

#### Parameters

| Name   | Type     | Description                                |
| :----- | :------- | :----------------------------------------- |
| `path` | `string` | The path to the file you want to write to. |
| `data` | `any`    |                                            |

#### Returns

`void`

---

### writefile

▸ **writefile**(`path`, `content`): `void`

Write the given content to the given file path.

#### Parameters

| Name      | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `path`    | `string` | The path to the file you want to write to. |
| `content` | `string` | The content to write to the file.          |

#### Returns

`void`
