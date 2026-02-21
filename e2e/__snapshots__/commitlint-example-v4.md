# Commitlint config

## Commit

_Object containing the following properties:_

| Property              | Type                                                   |
| :-------------------- | :----------------------------------------------------- |
| **`raw`** (\*)        | `string`                                               |
| **`header`** (\*)     | `string`                                               |
| **`type`** (\*)       | `string` (_nullable_)                                  |
| **`scope`** (\*)      | `string` (_nullable_)                                  |
| **`subject`** (\*)    | `string` (_nullable_)                                  |
| **`body`** (\*)       | `string` (_nullable_)                                  |
| **`footer`** (\*)     | `string` (_nullable_)                                  |
| **`mentions`** (\*)   | `Array<string>`                                        |
| **`notes`** (\*)      | _Array of_ [CommitNote](#commitnote) _items_           |
| **`references`** (\*) | _Array of_ [CommitReference](#commitreference) _items_ |
| **`revert`** (\*)     | `any`                                                  |
| **`merge`** (\*)      | `any`                                                  |

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

| Property     | Type      |
| :----------- | :-------- |
| `name`       | `string`  |
| `path`       | `string`  |
| `parserOpts` | `unknown` |

_All properties are optional._

## Plugin

_Object with dynamic keys:_

- _keys of type_ `string`
- _values of type_ _Object with properties:_
  - **`rules`** (\*): _Object with dynamic keys of type_ `string` _and values of type_ [Rule](#rule)

## PluginRecords

_Object with dynamic keys:_

- _keys of type_ `string`
- _values of type_ [Plugin](#plugin)

## PromptConfig

_Object containing the following properties:_

| Property             | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`settings`** (\*)  | _Object with properties:_<ul><li><b><code>scopeEnumSeparator</code></b> (\*): <code>string</code></li><li><b><code>enableMultipleScopes</code></b> (\*): <code>boolean</code></li></ul>                                                                                                                                                                                                                                                                                                                                                                      |
| **`messages`** (\*)  | [PromptMessages](#promptmessages)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **`questions`** (\*) | _Object with dynamic keys of type_ [PromptName](#promptname) _and values of type_ _Object with properties:_<ul><li><code>description</code>: <code>string</code></li><li><code>messages</code>: <code>Record<string, string></code></li><li><code>enum</code>: <i>Object with dynamic keys of type</i> <code>string</code> <i>and values of type</i> <i>Object with properties:</i><ul><li><code>description</code>: <code>string</code></li><li><code>title</code>: <code>string</code></li><li><code>emoji</code>: <code>string</code></li></ul></li></ul> |

_(\*) Required._

## PromptMessages

_Intersection of the following types:_

- _Object with properties:_
  - **`skip`** (\*): `string`
  - **`max`** (\*): `string`
  - **`min`** (\*): `string`
  - **`emptyWarning`** (\*): `string`
  - **`upperLimitWarning`** (\*): `string`
  - **`lowerLimitWarning`** (\*): `string`
- `Record<string, string>`

## PromptName

_Enum, one of the following possible values:_

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
2. [RuleConfigCondition](#ruleconfigcondition)
3. `never` (_optional_)

_Return value:_

- [RuleOutcome](#ruleoutcome) _or_ _Promise of:_ [RuleOutcome](#ruleoutcome)

## RuleConfigCondition

_Enum, one of the following possible values:_

- `'always'`
- `'never'`

## RuleConfigSeverity

_Enum, one of the following possible values:_

- `0`
- `1`
- `2`

## RuleConfigTuple

_Union of the following possible types:_

- `[0]`
- _Tuple:_
  1. [RuleConfigSeverity](#ruleconfigseverity)
  2. [RuleConfigCondition](#ruleconfigcondition)
- _Tuple:_
  1. [RuleConfigSeverity](#ruleconfigseverity)
  2. [RuleConfigCondition](#ruleconfigcondition)
  3. `unknown`

_Readonly._

## RuleOutcome

_Tuple, array of 2 items:_

1. `boolean`
2. `string` (_optional_)

_Readonly._

## RulesConfig

_Object with dynamic keys:_

- _keys of type_ `string`
- _values of type_ [RuleConfigTuple](#ruleconfigtuple)

## UserConfig

_Intersection of the following types:_

- _Object with properties:_
  - `extends`: `string | Array<string>`
  - `formatter`: `string`
  - `rules`: [RulesConfig](#rulesconfig)
  - `parserPreset`: `string`, [ParserPreset](#parserpreset) _or_ _Promise of:_ [ParserPreset](#parserpreset)
  - `ignores`: `Array<(string) => boolean>`
  - `defaultIgnores`: `boolean`
  - **`plugin`** (\*): [PluginRecords](#pluginrecords)
  - **`helpUrl`** (\*): `string`
  - **`prompt`** (\*): [UserPromptConfig](#userpromptconfig)
- `Record<string, unknown>`

## UserPromptConfig

_Object containing the following properties:_

| Property    | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `settings`  | _Object with properties:_<ul><li><b><code>scopeEnumSeparator</code></b> (\*): <code>string</code></li><li><b><code>enableMultipleScopes</code></b> (\*): <code>boolean</code></li></ul>                                                                                                                                                                                                                                                                                                                                                                      |
| `messages`  | [PromptMessages](#promptmessages)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `questions` | _Object with dynamic keys of type_ [PromptName](#promptname) _and values of type_ _Object with properties:_<ul><li><code>description</code>: <code>string</code></li><li><code>messages</code>: <code>Record<string, string></code></li><li><code>enum</code>: <i>Object with dynamic keys of type</i> <code>string</code> <i>and values of type</i> <i>Object with properties:</i><ul><li><code>description</code>: <code>string</code></li><li><code>title</code>: <code>string</code></li><li><code>emoji</code>: <code>string</code></li></ul></li></ul> |

_All properties are optional._
