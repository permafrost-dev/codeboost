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

## Properties

### name

• **name**: `string`

---

### owner

• **owner**: `string`

---

### path

• **path**: `string`

## Accessors

### git

• `get` **git**(): `SimpleGit`

#### Returns

`SimpleGit`

---

### info

• `get` **info**(): [`RepositoryInfo`](../interfaces/RepositoryInfo.md)

#### Returns

[`RepositoryInfo`](../interfaces/RepositoryInfo.md)

## Methods

### checkout

▸ **checkout**(`branchName`): `Promise`<`void`\>

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `branchName` | `string` |

#### Returns

`Promise`<`void`\>

---

### clone

▸ **clone**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

---

### createFork

▸ **createFork**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

---

### currentBranch

▸ **currentBranch**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

---

### defaultBranch

▸ **defaultBranch**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

---

### fullRepositoryName

▸ **fullRepositoryName**(): `string`

#### Returns

`string`

---

### localBranches

▸ **localBranches**(): `Promise`<`BranchSummary`\>

#### Returns

`Promise`<`BranchSummary`\>

---

### onBranch

▸ **onBranch**(`branchName`): `Promise`<`boolean`\>

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `branchName` | `string` |

#### Returns

`Promise`<`boolean`\>

---

### prepare

▸ **prepare**(): `Promise`<`void`\>

Checks out the default branch and pulls down the latest changes

#### Returns

`Promise`<`void`\>

---

### pushToFork

▸ **pushToFork**(`branchName`): `Promise`<`void`\>

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `branchName` | `string` |

#### Returns

`Promise`<`void`\>
