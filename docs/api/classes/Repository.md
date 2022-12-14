[codeboost](../README.md) / [Exports](../modules.md) / Repository

# Class: Repository

## Table of contents

### Constructors

-   [constructor](Repository.md#constructor)

### Properties

-   [name](Repository.md#name)
-   [owner](Repository.md#owner)
-   [path](Repository.md#path)

### Accessors

-   [git](Repository.md#git)
-   [info](Repository.md#info)

### Methods

-   [checkout](Repository.md#checkout)
-   [clone](Repository.md#clone)
-   [createFork](Repository.md#createfork)
-   [currentBranch](Repository.md#currentbranch)
-   [defaultBranch](Repository.md#defaultbranch)
-   [fullRepositoryName](Repository.md#fullrepositoryname)
-   [localBranches](Repository.md#localbranches)
-   [onBranch](Repository.md#onbranch)
-   [prepare](Repository.md#prepare)
-   [pushToFork](Repository.md#pushtofork)

## Constructors

### constructor

• **new Repository**(`fullRepositoryName`, `repositoryStoragePath`)

#### Parameters

| Name                    | Type     |
| :---------------------- | :------- |
| `fullRepositoryName`    | `string` |
| `repositoryStoragePath` | `string` |

#### Defined in

[lib/Repository.ts:34](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L34)

## Properties

### name

• **name**: `string`

#### Defined in

[lib/Repository.ts:10](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L10)

---

### owner

• **owner**: `string`

#### Defined in

[lib/Repository.ts:11](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L11)

---

### path

• **path**: `string`

#### Defined in

[lib/Repository.ts:12](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L12)

## Accessors

### git

• `get` **git**(): `SimpleGit`

#### Returns

`SimpleGit`

#### Defined in

[lib/Repository.ts:22](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L22)

---

### info

• `get` **info**(): [`RepositoryInfo`](../interfaces/RepositoryInfo.md)

#### Returns

[`RepositoryInfo`](../interfaces/RepositoryInfo.md)

#### Defined in

[lib/Repository.ts:15](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L15)

## Methods

### checkout

▸ **checkout**(`branchName`): `Promise`<`void`\>

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `branchName` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/Repository.ts:81](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L81)

---

### clone

▸ **clone**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/Repository.ts:43](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L43)

---

### createFork

▸ **createFork**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/Repository.ts:101](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L101)

---

### currentBranch

▸ **currentBranch**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[lib/Repository.ts:73](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L73)

---

### defaultBranch

▸ **defaultBranch**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[lib/Repository.ts:96](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L96)

---

### fullRepositoryName

▸ **fullRepositoryName**(): `string`

#### Returns

`string`

#### Defined in

[lib/Repository.ts:124](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L124)

---

### localBranches

▸ **localBranches**(): `Promise`<`BranchSummary`\>

#### Returns

`Promise`<`BranchSummary`\>

#### Defined in

[lib/Repository.ts:67](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L67)

---

### onBranch

▸ **onBranch**(`branchName`): `Promise`<`boolean`\>

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `branchName` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/Repository.ts:77](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L77)

---

### prepare

▸ **prepare**(): `Promise`<`void`\>

Checks out the default branch and pulls down the latest changes

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/Repository.ts:58](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L58)

---

### pushToFork

▸ **pushToFork**(`branchName`): `Promise`<`void`\>

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `branchName` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/Repository.ts:120](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/Repository.ts#L120)
