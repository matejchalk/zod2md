# User REST API

## GetUserParams

_Object containing the following properties:_

|Property|Type|Description|
|:--|:--|:--|
|**`username`** (\*)|`string`||

_(\*) Required._

## GetUserResponse

_Object containing the following properties:_

|Property|Type|Description|
|:--|:--|:--|
|**`username`** (\*)|`string`||
|**`email`** (\*)|`string`||
|`firstName`|`string`||
|`lastName`|`string`||

_(\*) Required._

## CreateUserParams

_Object containing the following properties:_

|Property|Type|Description|
|:--|:--|:--|
|**`username`** (\*)|`string`||
|**`email`** (\*)|`string`||
|`firstName`|`string`||
|`lastName`|`string`||
|**`password`** (\*)|`string`||

_(\*) Required._

## CreateUserResponse

_Object containing the following properties:_

|Property|Type|Description|
|:--|:--|:--|
|**`username`** (\*)|`string`||
|**`email`** (\*)|`string`||
|`firstName`|`string`||
|`lastName`|`string`||

_(\*) Required._

## UpdateUserParams

_Object containing the following properties:_

|Property|Type|Description|
|:--|:--|:--|
|**`username`** (\*)|`string`||

_(\*) Required._

## UpdateUserPayload

_Object containing the following properties:_

|Property|Type|Description|
|:--|:--|:--|
|**`email`** (\*)|`string`||
|`firstName`|`string`||
|`lastName`|`string`||

_(\*) Required._

## DeleteUserParams

_Object containing the following properties:_

|Property|Type|Description|
|:--|:--|:--|
|**`username`** (\*)|`string`||

_(\*) Required._
