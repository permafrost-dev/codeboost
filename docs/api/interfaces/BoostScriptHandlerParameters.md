[codeboost](../README.md) / [Exports](../modules.md) / BoostScriptHandlerParameters

# Interface: BoostScriptHandlerParameters

## Table of contents

### Properties

-   [args](BoostScriptHandlerParameters.md#args)
-   [boost](BoostScriptHandlerParameters.md#boost)
-   [currentRun](BoostScriptHandlerParameters.md#currentrun)
-   [git](BoostScriptHandlerParameters.md#git)
-   [libs](BoostScriptHandlerParameters.md#libs)
-   [repository](BoostScriptHandlerParameters.md#repository)
-   [tools](BoostScriptHandlerParameters.md#tools)

## Properties

### args

• **args**: `any`[]

arguments passed in from the user

#### Defined in

[lib/Boost.ts:16](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L16)

---

### boost

• **boost**: [`Boost`](../classes/Boost.md)

the boost instance

#### Defined in

[lib/Boost.ts:18](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L18)

---

### currentRun

• **currentRun**: [`BoostHistoryItem`](BoostHistoryItem.md)

information about the current boost run

#### Defined in

[lib/Boost.ts:20](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L20)

---

### git

• **git**: `SimpleGit`

a simpleGit instance for the repository

#### Defined in

[lib/Boost.ts:22](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L22)

---

### libs

• **libs**: `Object`

a collection of commonly-used libraries available to the boost scripts

#### Type declaration

| Name     | Type           |
| :------- | :------------- |
| `fs`     | `__module`     |
| `path`   | `PlatformPath` |
| `semver` | `__module`     |

#### Defined in

[lib/Boost.ts:24](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L24)

---

### repository

• **repository**: [`Repository`](../classes/Repository.md)

the repository instance

#### Defined in

[lib/Boost.ts:30](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L30)

---

### tools

• **tools**: [`Tools`](../classes/Tools.md)

a collection of utility functions available to the boost scripts

#### Defined in

[lib/Boost.ts:32](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L32)
