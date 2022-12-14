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
