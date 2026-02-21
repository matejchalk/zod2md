# User REST API

## GetUsersParams

_Object containing the following properties:_

| Property   | Type                       | Default |
| :--------- | :------------------------- | :------ |
| `page`     | `number` (_int, ≥1_)       | `1`     |
| `pageSize` | `number` (_int, ≥0, ≤100_) | `30`    |

_All properties are optional._

## GetUsersResponse

_Object containing the following properties:_

| Property         | Type                                                                                                                                                                                                                                                                                                               |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`users`** (\*) | _Array of objects:_<ul><li><b><code>username</code></b> (\*): <code>string</code> (<i>regex: `/^[a-z][a-z\d.]*$/`</i>)</li><li><b><code>email</code></b> (\*): <code>string</code> (<i>email</i>)</li><li><code>firstName</code>: <code>string</code></li><li><code>lastName</code>: <code>string</code></li></ul> |

_(\*) Required._

## GetUserParams

_Object containing the following properties:_

| Property            | Type                                     |
| :------------------ | :--------------------------------------- |
| **`username`** (\*) | `string` (_regex: `/^[a-z][a-z\d.]*$/`_) |

_(\*) Required._

## GetUserResponse

_Object containing the following properties:_

| Property            | Type                                     |
| :------------------ | :--------------------------------------- |
| **`username`** (\*) | `string` (_regex: `/^[a-z][a-z\d.]*$/`_) |
| **`email`** (\*)    | `string` (_email_)                       |
| `firstName`         | `string`                                 |
| `lastName`          | `string`                                 |

_(\*) Required._

## CreateUserParams

_Object containing the following properties:_

| Property            | Type                                     |
| :------------------ | :--------------------------------------- |
| **`username`** (\*) | `string` (_regex: `/^[a-z][a-z\d.]*$/`_) |
| **`email`** (\*)    | `string` (_email_)                       |
| `firstName`         | `string`                                 |
| `lastName`          | `string`                                 |
| **`password`** (\*) | `string` (_min length: 6_)               |

_(\*) Required._

## CreateUserResponse

_Object containing the following properties:_

| Property            | Type                                     |
| :------------------ | :--------------------------------------- |
| **`username`** (\*) | `string` (_regex: `/^[a-z][a-z\d.]*$/`_) |
| **`email`** (\*)    | `string` (_email_)                       |
| `firstName`         | `string`                                 |
| `lastName`          | `string`                                 |

_(\*) Required._

## UpdateUserParams

_Object containing the following properties:_

| Property            | Type                                     |
| :------------------ | :--------------------------------------- |
| **`username`** (\*) | `string` (_regex: `/^[a-z][a-z\d.]*$/`_) |

_(\*) Required._

## UpdateUserPayload

_Object containing the following properties:_

| Property         | Type               |
| :--------------- | :----------------- |
| **`email`** (\*) | `string` (_email_) |
| `firstName`      | `string`           |
| `lastName`       | `string`           |

_(\*) Required._

## DeleteUserParams

_Object containing the following properties:_

| Property            | Type                                     |
| :------------------ | :--------------------------------------- |
| **`username`** (\*) | `string` (_regex: `/^[a-z][a-z\d.]*$/`_) |

_(\*) Required._
