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

---

### boost

• **boost**: [`Boost`](../classes/Boost.md)

the boost instance

---

### currentRun

• **currentRun**: [`BoostHistoryItem`](BoostHistoryItem.md)

information about the current boost run

---

### git

• **git**: `SimpleGit`

a simpleGit instance for the repository

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

---

### repository

• **repository**: [`Repository`](../classes/Repository.md)

the repository instance

---

### tools

• **tools**: [`Tools`](../classes/Tools.md)

a collection of utility functions available to the boost scripts
