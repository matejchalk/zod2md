# Configuration API

## InputConfig

_Object containing the following properties:_

| Property         | Type     |
| ---------------- | -------- |
| **`entry`** (\*) | `string` |
| `tsconfig`       | `string` |

_(\*) Required._

## OutputConfig

_Object containing the following properties:_

| Property    | Type             | Default  |
| ----------- | ---------------- | -------- |
| `directory` | `string`         | `'docs'` |
| `format`    | `'md' \| 'html'` | `'md'`   |
| `clear`     | `boolean`        | `false`  |

_All properties are optional._

## Config

_Object containing the following properties:_

| Property         | Type                          |
| ---------------- | ----------------------------- |
| **`input`** (\*) | [InputConfig](#inputconfig)   |
| `output`         | [OutputConfig](#outputconfig) |

_(\*) Required._
