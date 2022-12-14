[codeboost](../README.md) / [Exports](../modules.md) / Github

# Class: Github

A class for interacting with the Github API

## Table of contents

### Constructors

-   [constructor](Github.md#constructor)

### Methods

-   [createPullRequest](Github.md#createpullrequest)
-   [currentUser](Github.md#currentuser)
-   [forkRepository](Github.md#forkrepository)
-   [getRepository](Github.md#getrepository)
-   [initCache](Github.md#initcache)

## Constructors

### constructor

• **new Github**()

## Methods

### createPullRequest

▸ `Static` **createPullRequest**(`repository`, `branchName`, `defaultBranchName`, `title`, `body`, `octokit?`): `Promise`<`any`\>

#### Parameters

| Name                | Type                                                | Default value |
| :------------------ | :-------------------------------------------------- | :------------ |
| `repository`        | [`RepositoryInfo`](../interfaces/RepositoryInfo.md) | `undefined`   |
| `branchName`        | `string`                                            | `undefined`   |
| `defaultBranchName` | `string`                                            | `undefined`   |
| `title`             | `string`                                            | `undefined`   |
| `body`              | `string`                                            | `undefined`   |
| `octokit`           | `null` \| `Octokit`                                 | `null`        |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/github.ts:112](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/github.ts#L112)

---

### currentUser

▸ `Static` **currentUser**(`octokit?`): `Promise`<{ `login`: `string` }\>

#### Parameters

| Name      | Type                | Default value |
| :-------- | :------------------ | :------------ |
| `octokit` | `null` \| `Octokit` | `null`        |

#### Returns

`Promise`<{ `login`: `string` }\>

#### Defined in

[lib/github.ts:52](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/github.ts#L52)

---

### forkRepository

▸ `Static` **forkRepository**(`repository`, `octokit?`): `Promise`<`any`\>

Attempts to fork a repository into the currently authenticated user's account.
Throws an error if the fork already exists.

#### Parameters

| Name         | Type                                                | Default value |
| :----------- | :-------------------------------------------------- | :------------ |
| `repository` | [`RepositoryInfo`](../interfaces/RepositoryInfo.md) | `undefined`   |
| `octokit`    | `null` \| `Octokit`                                 | `null`        |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/github.ts:77](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/github.ts#L77)

---

### getRepository

▸ `Static` **getRepository**(`repository`, `octokit?`): `Promise`<`any`\>

#### Parameters

| Name         | Type                                                | Default value |
| :----------- | :-------------------------------------------------- | :------------ |
| `repository` | [`RepositoryInfo`](../interfaces/RepositoryInfo.md) | `undefined`   |
| `octokit`    | `null` \| `Octokit`                                 | `null`        |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/github.ts:99](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/github.ts#L99)

---

### initCache

▸ `Static` **initCache**(`octokit?`): `Promise`<`void`\>

#### Parameters

| Name      | Type                | Default value |
| :-------- | :------------------ | :------------ |
| `octokit` | `null` \| `Octokit` | `null`        |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/github.ts:46](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/lib/github.ts#L46)
