# Config file reference

## Config

object containing the following properties:

|Property|Required?|Type|
|:--|:-:|:--|
|`entry`|yes|string|
|`platform`|no|[Platform](#platform)|
|`format`|no|array of [Format](#format) items|
|`dts`|no|boolean|

## Format

enum string, one of the following possible values:

- `"esm"`
- `"cjs"`

## Platform

enum string, one of the following possible values:

- `"browser"`
- `"node"`
