[codeboost](../README.md) / [Exports](../modules.md) / BoostConfiguration

# Interface: BoostConfiguration

## Table of contents

### Properties

-   [id](BoostConfiguration.md#id)
-   [pull_request](BoostConfiguration.md#pull_request)
-   [repository_limits](BoostConfiguration.md#repository_limits)
-   [scripts](BoostConfiguration.md#scripts)
-   [version](BoostConfiguration.md#version)

## Properties

### id

• **id**: `string`

#### Defined in

[types/BoostConfiguration.ts:2](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/types/BoostConfiguration.ts#L2)

---

### pull_request

• **pull_request**: `Object`

#### Type declaration

| Name     | Type     |
| :------- | :------- |
| `body`   | `string` |
| `branch` | `string` |
| `title`  | `string` |

#### Defined in

[types/BoostConfiguration.ts:8](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/types/BoostConfiguration.ts#L8)

---

### repository_limits

• **repository_limits**: `Object`

#### Type declaration

| Name                   | Type     |
| :--------------------- | :------- |
| `max_runs_per_version` | `number` |
| `minutes_between_runs` | `number` |

#### Defined in

[types/BoostConfiguration.ts:4](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/types/BoostConfiguration.ts#L4)

---

### scripts

• **scripts**: `Object`

#### Type declaration

| Name       | Type       |
| :--------- | :--------- |
| `files`    | `string`[] |
| `parallel` | `boolean`  |

#### Defined in

[types/BoostConfiguration.ts:13](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/types/BoostConfiguration.ts#L13)

---

### version

• **version**: `string`

#### Defined in

[types/BoostConfiguration.ts:3](https://github.com/permafrost-dev/codeboost/blob/0b270dd/src/types/BoostConfiguration.ts#L3)
