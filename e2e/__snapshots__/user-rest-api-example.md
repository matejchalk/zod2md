# User REST API

## GetUsersParams

_Object containing the following properties:_

| Property   | Type     | Default |
| :--------- | :------- | :------ |
| `page`     | `number` | `1`     |
| `pageSize` | `number` | `30`    |

_All properties are optional._

## GetUsersResponse

_Object containing the following properties:_

| Property         | Type                                                                                                                                                 |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`users`** (\*) | _Array of objects:_<br /><ul><li>`username`: `string`</li><li>`email`: `string`</li><li>`firstName`: `string`</li><li>`lastName`: `string`</li></ul> |

_(\*) Required._

## GetUserParams

_Object containing the following properties:_

| Property            | Type     |
| :------------------ | :------- |
| **`username`** (\*) | `string` |

_(\*) Required._

## GetUserResponse

_Object containing the following properties:_

| Property            | Type     |
| :------------------ | :------- |
| **`username`** (\*) | `string` |
| **`email`** (\*)    | `string` |
| `firstName`         | `string` |
| `lastName`          | `string` |

_(\*) Required._

## CreateUserParams

_Object containing the following properties:_

| Property            | Type     |
| :------------------ | :------- |
| **`username`** (\*) | `string` |
| **`email`** (\*)    | `string` |
| `firstName`         | `string` |
| `lastName`          | `string` |
| **`password`** (\*) | `string` |

_(\*) Required._

## CreateUserResponse

_Object containing the following properties:_

| Property            | Type     |
| :------------------ | :------- |
| **`username`** (\*) | `string` |
| **`email`** (\*)    | `string` |
| `firstName`         | `string` |
| `lastName`          | `string` |

_(\*) Required._

## UpdateUserParams

_Object containing the following properties:_

| Property            | Type     |
| :------------------ | :------- |
| **`username`** (\*) | `string` |

_(\*) Required._

## UpdateUserPayload

_Object containing the following properties:_

| Property         | Type     |
| :--------------- | :------- |
| **`email`** (\*) | `string` |
| `firstName`      | `string` |
| `lastName`       | `string` |

_(\*) Required._

## DeleteUserParams

_Object containing the following properties:_

| Property            | Type     |
| :------------------ | :------- |
| **`username`** (\*) | `string` |

_(\*) Required._
