[codeboost](../README.md) / [Exports](../modules.md) / HistoryManager

# Class: HistoryManager

## Table of contents

### Constructors

-   [constructor](HistoryManager.md#constructor)

### Properties

-   [data](HistoryManager.md#data)
-   [filename](HistoryManager.md#filename)

### Methods

-   [createEntry](HistoryManager.md#createentry)
-   [for](HistoryManager.md#for)
-   [load](HistoryManager.md#load)
-   [save](HistoryManager.md#save)

## Constructors

### constructor

• **new HistoryManager**(`filename`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filename` | `string` |

#### Defined in

[lib/HistoryManager.ts:7](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/HistoryManager.ts#L7)

## Properties

### data

• **data**: [`BoostHistory`](../modules.md#boosthistory) = `[]`

#### Defined in

[lib/HistoryManager.ts:5](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/HistoryManager.ts#L5)

---

### filename

• **filename**: `string`

#### Defined in

[lib/HistoryManager.ts:7](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/HistoryManager.ts#L7)

## Methods

### createEntry

▸ **createEntry**(`item`): [`BoostHistoryItem`](../interfaces/BoostHistoryItem.md)

#### Parameters

| Name   | Type                                                    |
| :----- | :------------------------------------------------------ |
| `item` | [`BoostHistoryItem`](../interfaces/BoostHistoryItem.md) |

#### Returns

[`BoostHistoryItem`](../interfaces/BoostHistoryItem.md)

#### Defined in

[lib/HistoryManager.ts:15](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/HistoryManager.ts#L15)

---

### for

▸ **for**(`boostName`): [`BoostHistory`](../modules.md#boosthistory)

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `boostName` | `string` |

#### Returns

[`BoostHistory`](../modules.md#boosthistory)

#### Defined in

[lib/HistoryManager.ts:11](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/HistoryManager.ts#L11)

---

### load

▸ **load**(): `void`

#### Returns

`void`

#### Defined in

[lib/HistoryManager.ts:29](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/HistoryManager.ts#L29)

---

### save

▸ **save**(): `void`

#### Returns

`void`

#### Defined in

[lib/HistoryManager.ts:21](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/HistoryManager.ts#L21)
