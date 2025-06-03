# Commitlint config

## Commit

_Object containing the following properties:_

| Property              | Type                                                 |
| :-------------------- | :--------------------------------------------------- |
| **`raw`** (\*)        | `string`                                             |
| **`header`** (\*)     | `string`                                             |
| **`type`** (\*)       | `string` (_nullable_)                                |
| **`scope`** (\*)      | `string` (_nullable_)                                |
| **`subject`** (\*)    | `string` (_nullable_)                                |
| **`body`** (\*)       | `string` (_nullable_)                                |
| **`footer`** (\*)     | `string` (_nullable_)                                |
| **`mentions`** (\*)   | `Array<string>`                                      |
| **`notes`** (\*)      | _Array of [CommitNote](#commitnote) items_           |
| **`references`** (\*) | _Array of [CommitReference](#commitreference) items_ |
| `revert`              | `any` (_nullable_)                                   |
| `merge`               | `any` (_nullable_)                                   |

_(\*) Required._

## CommitNote

_Object containing the following properties:_

| Property         | Type     |
| :--------------- | :------- |
| **`title`** (\*) | `string` |
| **`text`** (\*)  | `string` |

_(\*) Required._

## CommitReference

_Object containing the following properties:_

| Property              | Type                  |
| :-------------------- | :-------------------- |
| **`raw`** (\*)        | `string`              |
| **`prefix`** (\*)     | `string`              |
| **`action`** (\*)     | `string` (_nullable_) |
| **`owner`** (\*)      | `string` (_nullable_) |
| **`repository`** (\*) | `string` (_nullable_) |
| **`issue`** (\*)      | `string` (_nullable_) |

_(\*) Required._

## ParserPreset

_Object containing the following properties:_

| Property     | Type                   |
| :----------- | :--------------------- |
| `name`       | `string`               |
| `path`       | `string`               |
| `parserOpts` | `unknown` (_nullable_) |

_All properties are optional._

## Plugin

_Object record with dynamic keys:_

- _keys of type_ `string`
- _values of type_ _Object with properties:_<ul><li>**`rules`** (\*): _Object with dynamic keys of type_ `string` _and values of type_ [Rule](#rule)</li></ul>

## PluginRecords

_Object record with dynamic keys:_

- _keys of type_ `string`
- _values of type_ [Plugin](#plugin)

## PromptConfig

_Object containing the following properties:_

| Property             | Type                                                                                                                                                                                                                                                                                                                                                                                                      |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`settings`** (\*)  | _Object with properties:_<ul><li>**`scopeEnumSeparator`** (\*): `string`</li><li>**`enableMultipleScopes`** (\*): `boolean`</li></ul>                                                                                                                                                                                                                                                                     |
| **`messages`** (\*)  | [PromptMessages](#promptmessages)                                                                                                                                                                                                                                                                                                                                                                         |
| **`questions`** (\*) | _Object with dynamic keys of type_ [PromptName](#promptname) _and values of type_ _Object with properties:_<ul><li>`description`: `string`</li><li>`messages`: `Record<string, string>`</li><li>`enum`: _Object with dynamic keys of type_ `string` _and values of type_ _Object with properties:_<ul><li>`description`: `string`</li><li>`title`: `string`</li><li>`emoji`: `string`</li></ul></li></ul> |

_(\*) Required._

## PromptMessages

_Intersection of the following types:_

- _Object with properties:_<ul><li>**`skip`** (\*): `string`</li><li>**`max`** (\*): `string`</li><li>**`min`** (\*): `string`</li><li>**`emptyWarning`** (\*): `string`</li><li>**`upperLimitWarning`** (\*): `string`</li><li>**`lowerLimitWarning`** (\*): `string`</li></ul>
- `Record<string, string>`

## PromptName

_Enum string, one of the following possible values:_

- `'header'`
- `'type'`
- `'scope'`
- `'subject'`
- `'body'`
- `'footer'`
- `'isBreaking'`
- `'breakingBody'`
- `'breaking'`
- `'isIssueAffected'`
- `'issuesBody'`
- `'issues'`

## Rule

_Function._

_Parameters:_

1. [Commit](#commit)
2. [RuleConfigCondition](#ruleconfigcondition) (_optional_)
3. `never` (_optional_)

_Returns:_

- [RuleOutcome](#ruleoutcome) _or_ _Promise of_ [RuleOutcome](#ruleoutcome)

## RuleConfigCondition

_Enum string, one of the following possible values:_

- `'always'`
- `'never'`

## RuleConfigSeverity

_Native enum:_

| Key        | Value |
| :--------- | :---- |
| `Disabled` | `0`   |
| `Warning`  | `1`   |
| `Error`    | `2`   |

## RuleConfigTuple

_Union of the following possible types:_

- [0]
- _Tuple:_<ol><li>[RuleConfigSeverity](#ruleconfigseverity)</li><li>[RuleConfigCondition](#ruleconfigcondition)</li></ol>
- _Tuple:_<ol><li>[RuleConfigSeverity](#ruleconfigseverity)</li><li>[RuleConfigCondition](#ruleconfigcondition)</li><li>`unknown` (_optional & nullable_)</li></ol>
 (_readonly_)

## RuleOutcome

_Tuple, array of 2 items:_

1. `boolean`
2. `string` (_optional_)
 (_readonly_)

## RulesConfig

_Object record with dynamic keys:_

- _keys of type_ `string`
- _values of type_ [RuleConfigTuple](#ruleconfigtuple)

## UserConfig

_Intersection of the following types:_

- _Object with properties:_<ul><li>`extends`: `string | Array<string>`</li><li>`formatter`: `string`</li><li>`rules`: [RulesConfig](#rulesconfig)</li><li>`parserPreset`: `string`, [ParserPreset](#parserpreset) _or_ _Promise of_ [ParserPreset](#parserpreset)</li><li>`ignores`: `Array<(string) => boolean>`</li><li>`defaultIgnores`: `boolean`</li><li>**`plugin`** (\*): [PluginRecords](#pluginrecords)</li><li>**`helpUrl`** (\*): `string`</li><li>**`prompt`** (\*): [UserPromptConfig](#userpromptconfig)</li></ul>
- _Object with dynamic keys of type_ `string` _and values of type_ `unknown` (_optional & nullable_)

## UserPromptConfig

_Object containing the following properties:_

| Property    | Type                                                                                                                                                                                                                                                                                                                                                                                                      |
| :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `settings`  | _Object with properties:_<ul><li>`scopeEnumSeparator`: `string`</li><li>`enableMultipleScopes`: `boolean`</li></ul>                                                                                                                                                                                                                                                                                       |
| `messages`  | [PromptMessages](#promptmessages)                                                                                                                                                                                                                                                                                                                                                                         |
| `questions` | _Object with dynamic keys of type_ [PromptName](#promptname) _and values of type_ _Object with properties:_<ul><li>`description`: `string`</li><li>`messages`: `Record<string, string>`</li><li>`enum`: _Object with dynamic keys of type_ `string` _and values of type_ _Object with properties:_<ul><li>`description`: `string`</li><li>`title`: `string`</li><li>`emoji`: `string`</li></ul></li></ul> |

_All properties are optional._
