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

## Properties

### data

• **data**: [`BoostHistory`](../modules.md#boosthistory) = `[]`

---

### filename

• **filename**: `string`

## Methods

### createEntry

▸ **createEntry**(`item`): [`BoostHistoryItem`](../interfaces/BoostHistoryItem.md)

#### Parameters

| Name   | Type                                                    |
| :----- | :------------------------------------------------------ |
| `item` | [`BoostHistoryItem`](../interfaces/BoostHistoryItem.md) |

#### Returns

[`BoostHistoryItem`](../interfaces/BoostHistoryItem.md)

---

### for

▸ **for**(`boostName`): [`BoostHistory`](../modules.md#boosthistory)

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `boostName` | `string` |

#### Returns

[`BoostHistory`](../modules.md#boosthistory)

---

### load

▸ **load**(): `void`

#### Returns

`void`

---

### save

▸ **save**(): `void`

#### Returns

`void`
