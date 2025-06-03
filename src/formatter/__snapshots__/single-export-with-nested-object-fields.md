# Person reference

## Person

_Object containing the following properties:_

| Property           | Description       | Type                                                                                                                                                                                                         |
| :----------------- | :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** (\*)    | Person's name     | `string`                                                                                                                                                                                                     |
| **`age`** (\*)     | Person's age      | `number`                                                                                                                                                                                                     |
| **`address`** (\*) | Person's address  | _Object with properties:_<ul><li>**`street`** (\*): `string` - Street name</li><li>**`city`** (\*): `string` - City name</li><li>`zip`: `string` - Zip code</li><li>`state`: `string` - State name</li></ul> |
| `nickname`         | Optional nickname | `string`                                                                                                                                                                                                     |
| `hobbies`          | List of hobbies   | `Array<string>`                                                                                                                                                                                              |

_(\*) Required._
