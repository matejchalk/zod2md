# Config file reference

## Config

_Object containing the following properties:_

| Property         | Type                    | Description             |
| :--------------- | :---------------------- | :---------------------- |
| **`entry`** (\*) | `string`                | Entry point             |
| `platform`       | `'browser' \| 'node'`   | Target platform         |
| `format`         | `Array<'esm' \| 'cjs'>` | Module formats          |
| `dts`            | `boolean`               | Emit declaration files? |

_(\*) Required._
