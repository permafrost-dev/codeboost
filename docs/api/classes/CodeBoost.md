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

#### Defined in

[lib/CodeBoost.ts:14](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/CodeBoost.ts#L14)

## Properties

### appSettings

• **appSettings**: [`AppSettings`](../interfaces/AppSettings.md)

#### Defined in

[lib/CodeBoost.ts:10](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/CodeBoost.ts#L10)

---

### historyManager

• **historyManager**: [`HistoryManager`](HistoryManager.md)

#### Defined in

[lib/CodeBoost.ts:11](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/CodeBoost.ts#L11)

---

### logger

• **logger**: `Logger`

#### Inherited from

[HasLogger](HasLogger.md).[logger](HasLogger.md#logger)

#### Defined in

[traits/HasLogger.ts:10](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/traits/HasLogger.ts#L10)

---

### repositoryPrepared

• **repositoryPrepared**: `boolean` = `false`

#### Defined in

[lib/CodeBoost.ts:12](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/CodeBoost.ts#L12)

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

#### Defined in

[traits/HasLogger.ts:12](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/traits/HasLogger.ts#L12)

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

#### Defined in

[lib/CodeBoost.ts:21](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/CodeBoost.ts#L21)

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

#### Defined in

[traits/HasLogger.ts:29](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/traits/HasLogger.ts#L29)

---

### prepareRepository

▸ **prepareRepository**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/CodeBoost.ts:26](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/CodeBoost.ts#L26)

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

#### Defined in

[lib/CodeBoost.ts:41](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/CodeBoost.ts#L41)
