[codeboost](../README.md) / [Exports](../modules.md) / CodeBoost

# Class: CodeBoost

## Hierarchy

-   [`HasLogger`](HasLogger.md)<`this`\>

    ↳ **`CodeBoost`**

## Table of contents

### Constructors

-   [constructor](CodeBoost.md#constructor)

### Properties

-   [appSettings](CodeBoost.md#appsettings)
-   [historyManager](CodeBoost.md#historymanager)
-   [logger](CodeBoost.md#logger)
-   [repositoryPrepared](CodeBoost.md#repositoryprepared)

### Methods

-   [createLogger](CodeBoost.md#createlogger)
-   [init](CodeBoost.md#init)
-   [log](CodeBoost.md#log)
-   [prepareRepository](CodeBoost.md#preparerepository)
-   [runBoost](CodeBoost.md#runboost)

## Constructors

### constructor

• **new CodeBoost**(`appSettings`, `historyManager`)

#### Parameters

| Name             | Type                                          |
| :--------------- | :-------------------------------------------- |
| `appSettings`    | [`AppSettings`](../interfaces/AppSettings.md) |
| `historyManager` | [`HistoryManager`](HistoryManager.md)         |

#### Overrides

[HasLogger](HasLogger.md).[constructor](HasLogger.md#constructor)

## Properties

### appSettings

• **appSettings**: [`AppSettings`](../interfaces/AppSettings.md)

---

### historyManager

• **historyManager**: [`HistoryManager`](HistoryManager.md)

---

### logger

• **logger**: `Logger`

#### Inherited from

[HasLogger](HasLogger.md).[logger](HasLogger.md#logger)

---

### repositoryPrepared

• **repositoryPrepared**: `boolean` = `false`

## Methods

### createLogger

▸ **createLogger**(`targets`, `defaultMeta`): `void`

#### Parameters

| Name          | Type                                     |
| :------------ | :--------------------------------------- |
| `targets`     | [`LogTarget`](../modules.md#logtarget)[] |
| `defaultMeta` | `Record`<`string`, `any`\>               |

#### Returns

`void`

#### Inherited from

[HasLogger](HasLogger.md).[createLogger](HasLogger.md#createlogger)

---

### init

▸ **init**(`repository`, `appSettings`): `Promise`<`void`\>

#### Parameters

| Name          | Type                                          |
| :------------ | :-------------------------------------------- |
| `repository`  | [`Repository`](Repository.md)                 |
| `appSettings` | [`AppSettings`](../interfaces/AppSettings.md) |

#### Returns

`Promise`<`void`\>

---

### log

▸ **log**(`message`, `meta?`): `void`

#### Parameters

| Name      | Type     | Default value |
| :-------- | :------- | :------------ |
| `message` | `string` | `undefined`   |
| `meta`    | `any`[]  | `[]`          |

#### Returns

`void`

#### Inherited from

[HasLogger](HasLogger.md).[log](HasLogger.md#log)

---

### prepareRepository

▸ **prepareRepository**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

---

### runBoost

▸ **runBoost**(`id`, `args`): `Promise`<[`Boost`](Boost.md)\>

#### Parameters

| Name   | Type       |
| :----- | :--------- |
| `id`   | `string`   |
| `args` | `string`[] |

#### Returns

`Promise`<[`Boost`](Boost.md)\>
