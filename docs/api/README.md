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

#### Defined in

[types/BoostHistory.ts:1](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/types/BoostHistory.ts#L1)

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

#### Defined in

[lib/Boost.ts:35](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L35)

---

### LogTarget

Ƭ **LogTarget**: `"console"` \| `"file"`

#### Defined in

[traits/HasLogger.ts:7](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/traits/HasLogger.ts#L7)

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

#### Defined in

[lib/Tools.ts:7](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Tools.ts#L7)

## Functions

### createOctokit

▸ **createOctokit**(): `Octokit`

#### Returns

`Octokit`

#### Defined in

[lib/github.ts:18](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/github.ts#L18)

---

### initOctokit

▸ **initOctokit**(`token`): `void`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `token` | `string` |

#### Returns

`void`

#### Defined in

[lib/github.ts:8](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/github.ts#L8)

---

### loadSettings

▸ **loadSettings**(`filename`): [`AppSettings`](interfaces/AppSettings.md)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filename` | `string` |

#### Returns

[`AppSettings`](interfaces/AppSettings.md)

#### Defined in

[lib/AppSettings.ts:14](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/AppSettings.ts#L14)

---

### transformSettings

▸ **transformSettings**(`settings`): [`AppSettings`](interfaces/AppSettings.md)

#### Parameters

| Name       | Type                                       |
| :--------- | :----------------------------------------- |
| `settings` | [`AppSettings`](interfaces/AppSettings.md) |

#### Returns

[`AppSettings`](interfaces/AppSettings.md)

#### Defined in

[lib/AppSettings.ts:20](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/AppSettings.ts#L20)
