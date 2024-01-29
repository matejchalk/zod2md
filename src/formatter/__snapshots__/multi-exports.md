# Config file reference

## Config

_Object containing the following properties:_

|Property|Type|Description|
|:--|:--|:--|
|**`entry`** (\*)|`string`|Entry point|
|`platform`|[Platform](#platform)|Target platform|
|`format`|array of [Format](#format) items|Module formats|
|`dts`|`boolean`|Emit declaration files?|

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
