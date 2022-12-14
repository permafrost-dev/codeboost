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

---

### pull_request

• **pull_request**: `Object`

#### Type declaration

| Name     | Type     |
| :------- | :------- |
| `body`   | `string` |
| `branch` | `string` |
| `title`  | `string` |

---

### repository_limits

• **repository_limits**: `Object`

#### Type declaration

| Name                   | Type     |
| :--------------------- | :------- |
| `max_runs_per_version` | `number` |
| `minutes_between_runs` | `number` |

---

### scripts

• **scripts**: `Object`

#### Type declaration

| Name       | Type       |
| :--------- | :--------- |
| `files`    | `string`[] |
| `parallel` | `boolean`  |

---

### version

• **version**: `string`
