# Config file reference

## Config

_Object containing the following properties:_

| Property         | Description             | Type                               | Default   |
| :--------------- | :---------------------- | :--------------------------------- | :-------- |
| **`entry`** (\*) | Entry point             | `string`                           |           |
| `platform`       | Target platform         | [Platform](#platform)              |           |
| `format`         | Module formats          | _Array of [Format](#format) items_ | `["esm"]` |
| `dts`            | Emit declaration files? | `boolean`                          | `false`   |

_(\*) Required._

## Format

Module format

_Enum string, one of the following possible values:_

- `'esm'`
- `'cjs'`

## Platform

Target platform

_Enum string, one of the following possible values:_

- `'browser'`
- `'node'`
