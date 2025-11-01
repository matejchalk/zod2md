# Config file reference

## Config

_Object containing the following properties:_

| Property         | Description             | Type                    |
| :--------------- | :---------------------- | :---------------------- |
| **`entry`** (\*) | Entry point             | `string`                |
| `platform`       | Target platform         | `'browser' \| 'node'`   |
| `format`         | Module formats          | `Array<'esm' \| 'cjs'>` |
| `dts`            | Emit declaration files? | `boolean`               |

_(\*) Required._
