[codeboost](README.md) / Exports

# codeboost

## Table of contents

### Enumerations

-   [BoostHistoryItemState](enums/BoostHistoryItemState.md)

### Classes

-   [Boost](classes/Boost.md)
-   [CodeBoost](classes/CodeBoost.md)
-   [Github](classes/Github.md)
-   [HasLogger](classes/HasLogger.md)
-   [HistoryManager](classes/HistoryManager.md)
-   [Repository](classes/Repository.md)
-   [Tools](classes/Tools.md)

### Interfaces

-   [AppSettings](interfaces/AppSettings.md)
-   [BoostConfiguration](interfaces/BoostConfiguration.md)
-   [BoostHistoryItem](interfaces/BoostHistoryItem.md)
-   [BoostScriptHandlerParameters](interfaces/BoostScriptHandlerParameters.md)
-   [RepositoryInfo](interfaces/RepositoryInfo.md)

### Type Aliases

-   [BoostHistory](modules.md#boosthistory)
-   [BoostScriptHandler](modules.md#boostscripthandler)
-   [LogTarget](modules.md#logtarget)
-   [OnFileCopiedCallback](modules.md#onfilecopiedcallback)

### Functions

-   [createOctokit](modules.md#createoctokit)
-   [initOctokit](modules.md#initoctokit)
-   [loadSettings](modules.md#loadsettings)
-   [transformSettings](modules.md#transformsettings)

## Type Aliases

### BoostHistory

Ƭ **BoostHistory**: [`BoostHistoryItem`](interfaces/BoostHistoryItem.md)[]

---

### BoostScriptHandler

Ƭ **BoostScriptHandler**: (`params`: [`BoostScriptHandlerParameters`](interfaces/BoostScriptHandlerParameters.md)) => `any`

#### Type declaration

▸ (`params`): `any`

##### Parameters

| Name     | Type                                                                         |
| :------- | :--------------------------------------------------------------------------- |
| `params` | [`BoostScriptHandlerParameters`](interfaces/BoostScriptHandlerParameters.md) |

##### Returns

`any`

---

### LogTarget

Ƭ **LogTarget**: `"console"` \| `"file"`

---

### OnFileCopiedCallback

Ƭ **OnFileCopiedCallback**: (`src`: `string`, `dest`: `string`) => `void`

#### Type declaration

▸ (`src`, `dest`): `void`

##### Parameters

| Name   | Type     |
| :----- | :------- |
| `src`  | `string` |
| `dest` | `string` |

##### Returns

`void`

## Functions

### createOctokit

▸ **createOctokit**(): `Octokit`

#### Returns

`Octokit`

---

### initOctokit

▸ **initOctokit**(`token`): `void`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `token` | `string` |

#### Returns

`void`

---

### loadSettings

▸ **loadSettings**(`filename`): [`AppSettings`](interfaces/AppSettings.md)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filename` | `string` |

#### Returns

[`AppSettings`](interfaces/AppSettings.md)

---

### transformSettings

▸ **transformSettings**(`settings`): [`AppSettings`](interfaces/AppSettings.md)

#### Parameters

| Name       | Type                                       |
| :--------- | :----------------------------------------- |
| `settings` | [`AppSettings`](interfaces/AppSettings.md) |

#### Returns

[`AppSettings`](interfaces/AppSettings.md)
