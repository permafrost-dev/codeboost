[codeboost](../README.md) / [Exports](../modules.md) / HasLogger

# Class: HasLogger

## Hierarchy

-   **`HasLogger`**

    ↳ [`CodeBoost`](CodeBoost.md)

## Table of contents

### Constructors

-   [constructor](HasLogger.md#constructor)

### Properties

-   [logger](HasLogger.md#logger)

### Methods

-   [createLogger](HasLogger.md#createlogger)
-   [log](HasLogger.md#log)

## Constructors

### constructor

• **new HasLogger**()

## Properties

### logger

• **logger**: `Logger`

#### Defined in

[traits/HasLogger.ts:10](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/traits/HasLogger.ts#L10)

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

#### Defined in

[traits/HasLogger.ts:12](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/traits/HasLogger.ts#L12)

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

#### Defined in

[traits/HasLogger.ts:29](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/traits/HasLogger.ts#L29)
