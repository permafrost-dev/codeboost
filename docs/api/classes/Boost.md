[codeboost](../README.md) / [Exports](../modules.md) / Boost

# Class: Boost

## Table of contents

### Constructors

-   [constructor](Boost.md#constructor)

### Properties

-   [actions](Boost.md#actions)
-   [changedFiles](Boost.md#changedfiles)
-   [config](Boost.md#config)
-   [id](Boost.md#id)
-   [path](Boost.md#path)
-   [pullRequest](Boost.md#pullrequest)
-   [repositoryLimits](Boost.md#repositorylimits)
-   [runId](Boost.md#runid)
-   [scripts](Boost.md#scripts)
-   [state](Boost.md#state)
-   [version](Boost.md#version)

### Accessors

-   [appSettings](Boost.md#appsettings)
-   [history](Boost.md#history)

### Methods

-   [canRunOnRepository](Boost.md#canrunonrepository)
-   [checkoutPullRequestBranch](Boost.md#checkoutpullrequestbranch)
-   [createScriptHandlerParameters](Boost.md#createscripthandlerparameters)
-   [init](Boost.md#init)
-   [loadConfiguration](Boost.md#loadconfiguration)
-   [loadPullRequest](Boost.md#loadpullrequest)
-   [loadScripts](Boost.md#loadscripts)
-   [log](Boost.md#log)
-   [run](Boost.md#run)
-   [runInitializationScript](Boost.md#runinitializationscript)
-   [runScripts](Boost.md#runscripts)
-   [updatePullRequestBranchName](Boost.md#updatepullrequestbranchname)

## Constructors

### constructor

• **new Boost**(`codeBoost`, `boostPath`)

#### Parameters

| Name        | Type                        |
| :---------- | :-------------------------- |
| `codeBoost` | [`CodeBoost`](CodeBoost.md) |
| `boostPath` | `string`                    |

#### Defined in

[lib/Boost.ts:60](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L60)

## Properties

### actions

• **actions**: `any`[]

#### Defined in

[lib/Boost.ts:55](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L55)

---

### changedFiles

• **changedFiles**: `string`[] = `[]`

#### Defined in

[lib/Boost.ts:57](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L57)

---

### config

• **config**: [`BoostConfiguration`](../interfaces/BoostConfiguration.md)

#### Defined in

[lib/Boost.ts:41](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L41)

---

### id

• **id**: `string`

#### Defined in

[lib/Boost.ts:43](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L43)

---

### path

• **path**: `string`

#### Defined in

[lib/Boost.ts:42](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L42)

---

### pullRequest

• **pullRequest**: `Object`

#### Type declaration

| Name     | Type     |
| :------- | :------- |
| `body`   | `string` |
| `branch` | `string` |
| `title`  | `string` |

#### Defined in

[lib/Boost.ts:49](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L49)

---

### repositoryLimits

• **repositoryLimits**: `Object`

#### Type declaration

| Name                 | Type     |
| :------------------- | :------- |
| `maxRunsPerVersion`  | `number` |
| `minutesBetweenRuns` | `number` |

#### Defined in

[lib/Boost.ts:45](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L45)

---

### runId

• **runId**: `string`

#### Defined in

[lib/Boost.ts:58](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L58)

---

### scripts

• **scripts**: `any`[]

#### Defined in

[lib/Boost.ts:54](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L54)

---

### state

• **state**: `Record`<`string`, `any`\> = `{}`

#### Defined in

[lib/Boost.ts:56](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L56)

---

### version

• **version**: `string`

#### Defined in

[lib/Boost.ts:44](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L44)

## Accessors

### appSettings

• `get` **appSettings**(): [`AppSettings`](../interfaces/AppSettings.md)

#### Returns

[`AppSettings`](../interfaces/AppSettings.md)

#### Defined in

[lib/Boost.ts:81](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L81)

---

### history

• `get` **history**(): [`BoostHistory`](../modules.md#boosthistory)

#### Returns

[`BoostHistory`](../modules.md#boosthistory)

#### Defined in

[lib/Boost.ts:85](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L85)

## Methods

### canRunOnRepository

▸ **canRunOnRepository**(`repo`): `boolean`

#### Parameters

| Name   | Type                                      |
| :----- | :---------------------------------------- |
| `repo` | `string` \| [`Repository`](Repository.md) |

#### Returns

`boolean`

#### Defined in

[lib/Boost.ts:268](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L268)

---

### checkoutPullRequestBranch

▸ **checkoutPullRequestBranch**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/Boost.ts:228](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L228)

---

### createScriptHandlerParameters

▸ **createScriptHandlerParameters**(`args`, `historyItem`): [`BoostScriptHandlerParameters`](../interfaces/BoostScriptHandlerParameters.md)

#### Parameters

| Name          | Type                                                    |
| :------------ | :------------------------------------------------------ |
| `args`        | `any`[]                                                 |
| `historyItem` | [`BoostHistoryItem`](../interfaces/BoostHistoryItem.md) |

#### Returns

[`BoostScriptHandlerParameters`](../interfaces/BoostScriptHandlerParameters.md)

#### Defined in

[lib/Boost.ts:205](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L205)

---

### init

▸ **init**(`boostPath`): `void`

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `boostPath` | `string` |

#### Returns

`void`

#### Defined in

[lib/Boost.ts:67](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L67)

---

### loadConfiguration

▸ **loadConfiguration**(`boostPath`): [`BoostConfiguration`](../interfaces/BoostConfiguration.md)

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `boostPath` | `string` |

#### Returns

[`BoostConfiguration`](../interfaces/BoostConfiguration.md)

#### Defined in

[lib/Boost.ts:93](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L93)

---

### loadPullRequest

▸ **loadPullRequest**(`pullRequest`): `Object`

#### Parameters

| Name          | Type                       |
| :------------ | :------------------------- |
| `pullRequest` | `Record`<`string`, `any`\> |

#### Returns

`Object`

| Name     | Type     |
| :------- | :------- |
| `body`   | `any`    |
| `branch` | `string` |
| `title`  | `any`    |

#### Defined in

[lib/Boost.ts:99](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L99)

---

### loadScripts

▸ **loadScripts**(`scripts`): `any`[]

#### Parameters

| Name      | Type       |
| :-------- | :--------- |
| `scripts` | `string`[] |

#### Returns

`any`[]

#### Defined in

[lib/Boost.ts:107](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L107)

---

### log

▸ **log**(`message`): `void`

#### Parameters

| Name      | Type  |
| :-------- | :---- |
| `message` | `any` |

#### Returns

`void`

#### Defined in

[lib/Boost.ts:89](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L89)

---

### run

▸ **run**(`repository`, `args?`): `Promise`<`undefined` \| `false`\>

#### Parameters

| Name         | Type                          | Default value |
| :----------- | :---------------------------- | :------------ |
| `repository` | [`Repository`](Repository.md) | `undefined`   |
| `args`       | `any`[]                       | `[]`          |

#### Returns

`Promise`<`undefined` \| `false`\>

#### Defined in

[lib/Boost.ts:123](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L123)

---

### runInitializationScript

▸ **runInitializationScript**(`params`): `Promise`<`void`\>

#### Parameters

| Name     | Type                                                                            |
| :------- | :------------------------------------------------------------------------------ |
| `params` | [`BoostScriptHandlerParameters`](../interfaces/BoostScriptHandlerParameters.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/Boost.ts:221](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L221)

---

### runScripts

▸ **runScripts**(`params`): `Promise`<`void`\>

#### Parameters

| Name     | Type                                                                            |
| :------- | :------------------------------------------------------------------------------ |
| `params` | [`BoostScriptHandlerParameters`](../interfaces/BoostScriptHandlerParameters.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/Boost.ts:257](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L257)

---

### updatePullRequestBranchName

▸ **updatePullRequestBranchName**(): `Promise`<`boolean`\>

update to a unique branch name if the branch already exists

#### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/Boost.ts:235](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Boost.ts#L235)
