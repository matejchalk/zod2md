# Config file reference

## Config

Object containing the following properties:

|Property|Type|
|:--|:--|
|**`entry`** (\*)|`string`|
|`platform`|[Platform](#platform)|
|`format`|array of [Format](#format) items|
|`dts`|`boolean`|

_Properties marked with (\*) are required._

## Format

Enum string, one of the following possible values:

- `'esm'`
- `'cjs'`

## Platform

Enum string, one of the following possible values:

- `'browser'`
- `'node'`
