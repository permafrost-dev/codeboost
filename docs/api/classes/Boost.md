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

## Properties

### actions

• **actions**: `any`[]

---

### changedFiles

• **changedFiles**: `string`[] = `[]`

---

### config

• **config**: [`BoostConfiguration`](../interfaces/BoostConfiguration.md)

---

### id

• **id**: `string`

---

### path

• **path**: `string`

---

### pullRequest

• **pullRequest**: `Object`

#### Type declaration

| Name     | Type     |
| :------- | :------- |
| `body`   | `string` |
| `branch` | `string` |
| `title`  | `string` |

---

### repositoryLimits

• **repositoryLimits**: `Object`

#### Type declaration

| Name                 | Type     |
| :------------------- | :------- |
| `maxRunsPerVersion`  | `number` |
| `minutesBetweenRuns` | `number` |

---

### runId

• **runId**: `string`

---

### scripts

• **scripts**: `any`[]

---

### state

• **state**: `Record`<`string`, `any`\> = `{}`

---

### version

• **version**: `string`

## Accessors

### appSettings

• `get` **appSettings**(): [`AppSettings`](../interfaces/AppSettings.md)

#### Returns

[`AppSettings`](../interfaces/AppSettings.md)

---

### history

• `get` **history**(): [`BoostHistory`](../modules.md#boosthistory)

#### Returns

[`BoostHistory`](../modules.md#boosthistory)

## Methods

### canRunOnRepository

▸ **canRunOnRepository**(`repo`): `boolean`

#### Parameters

| Name   | Type                                      |
| :----- | :---------------------------------------- |
| `repo` | `string` \| [`Repository`](Repository.md) |

#### Returns

`boolean`

---

### checkoutPullRequestBranch

▸ **checkoutPullRequestBranch**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

---

### init

▸ **init**(`boostPath`): `void`

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `boostPath` | `string` |

#### Returns

`void`

---

### loadConfiguration

▸ **loadConfiguration**(`boostPath`): [`BoostConfiguration`](../interfaces/BoostConfiguration.md)

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `boostPath` | `string` |

#### Returns

[`BoostConfiguration`](../interfaces/BoostConfiguration.md)

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

---

### loadScripts

▸ **loadScripts**(`scripts`): `any`[]

#### Parameters

| Name      | Type       |
| :-------- | :--------- |
| `scripts` | `string`[] |

#### Returns

`any`[]

---

### log

▸ **log**(`message`): `void`

#### Parameters

| Name      | Type  |
| :-------- | :---- |
| `message` | `any` |

#### Returns

`void`

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

---

### runInitializationScript

▸ **runInitializationScript**(`params`): `Promise`<`void`\>

#### Parameters

| Name     | Type                                                                            |
| :------- | :------------------------------------------------------------------------------ |
| `params` | [`BoostScriptHandlerParameters`](../interfaces/BoostScriptHandlerParameters.md) |

#### Returns

`Promise`<`void`\>

---

### runScripts

▸ **runScripts**(`params`): `Promise`<`void`\>

#### Parameters

| Name     | Type                                                                            |
| :------- | :------------------------------------------------------------------------------ |
| `params` | [`BoostScriptHandlerParameters`](../interfaces/BoostScriptHandlerParameters.md) |

#### Returns

`Promise`<`void`\>

---

### updatePullRequestBranchName

▸ **updatePullRequestBranchName**(): `Promise`<`boolean`\>

update to a unique branch name if the branch already exists

#### Returns

`Promise`<`boolean`\>
