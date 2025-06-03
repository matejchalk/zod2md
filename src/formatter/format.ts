import type { EnumLike } from 'zod';
import type { Model, ModelMeta, ModelOrRef, NamedModel, Ref } from '../types';
import * as md from './markdown';
import { defaultNameTransform } from './name-transform';
import type { NameTransformFn, FormatterOptions } from './types';

const MAX_VALUES = 20;

export function formatModelsAsMarkdown(
  models: NamedModel[],
  options: FormatterOptions
): string {
  const { title, transformName = defaultNameTransform } = options;
  return md.document(
    md.paragraphs(
      md.heading(1, title),
      ...models.flatMap(model => [
        md.heading(2, transformName(model.name, model.path)),
        model.description,
        formatModel(model, transformName) + metaToSuffix(model),
        'default' in model &&
          `${md.italic('Default value:')} ${md.code.inline(
            formatLiteral(model.default)
          )}`,
      ])
    )
  );
}

function formatModel(model: Model, transformName: NameTransformFn): string {
  switch (model.type) {
    case 'array':
      if (model.items.kind === 'model' && model.items.model.type === 'object') {
        const formattedObject = formatModel(model.items.model, transformName);
        return formattedObject.replace('Object', 'Array of objects');
      }
      const lengthPrefix = model.validations?.length
        ? smartJoin(
            model.validations.map(([key, value]): string => {
              switch (key) {
                case 'min':
                  return `at least ${value}`;
                case 'max':
                  return `at most ${value}`;
                case 'length':
                  return `exactly ${value}`;
              }
            }),
            ' and '
          ) + ' '
        : '';
      const isPlural =
        model.validations?.every(([, value]) => value === 1) ?? true;
      return md.italic(
        `Array of ${lengthPrefix}${formatModelOrRef(
          model.items,
          transformName
        )} ${isPlural ? 'items' : 'item'}.`
      );
    case 'object':
      const hasDefault = model.fields.some(
        field => 'default' in metaFromModelOrRef(field)
      );
      const hasDescription = model.fields.some(
        field => metaFromModelOrRef(field).description
      );
      return md.paragraphs(
        md.italic('Object containing the following properties:'),
        md.table(
          model.fields.map(field => {
            const meta = field.kind === 'model' ? field.model : field.ref;
            return [
              field.required
                ? `${md.bold(md.code.inline(field.key))} (\\*)`
                : md.code.inline(field.key),
              ...(hasDescription ? [meta.description ?? ''] : []),
              formatModelOrRef(field, transformName),
              ...(hasDefault
                ? [
                    'default' in meta
                      ? md.code.inline(formatLiteral(meta.default))
                      : '',
                  ]
                : []),
            ];
          }),
          [
            'Property',
            ...(hasDescription ? ['Description'] : []),
            'Type',
            ...(hasDefault ? ['Default'] : []),
          ]
        ),
        md.italic(
          model.fields.some(({ required }) => required)
            ? '(\\*) Required.'
            : 'All properties are optional.'
        )
      );
    case 'enum':
      const enumList = md.list.unordered(
        model.values.map(value => md.code.inline(`'${value}'`))
      );
      return md.paragraphs(
        md.italic('Enum string, one of the following possible values:'),
        model.values.length > MAX_VALUES
          ? md.details(
              md.italic(
                `Expand for full list of ${model.values.length} values`,
                'html'
              ),
              enumList
            )
          : enumList
      );
    case 'native-enum':
      return md.paragraphs(
        md.italic('Native enum:'),
        md.table(
          nativeEnumEntries(model.enum).map(([key, value]) => [
            md.code.inline(key),
            md.code.inline(formatLiteral(value)),
          ]),
          ['Key', 'Value']
        )
      );
    case 'union':
      return md.paragraphs(
        md.italic('Union of the following possible types:'),
        md.list.unordered(
          model.options.map(option => formatModelOrRef(option, transformName))
        )
      );
    case 'intersection':
      return md.paragraphs(
        md.italic('Intersection of the following types:'),
        md.list.unordered(
          model.parts.map(part => formatModelOrRef(part, transformName))
        )
      );
    case 'record':
      return md.paragraphs(
        md.italic('Object record with dynamic keys:'),
        md.list.unordered([
          `${md.italic('keys of type')} ${formatModelOrRef(
            model.keys,
            transformName
          )}`,
          `${md.italic('values of type')} ${formatModelOrRef(
            model.values,
            transformName
          )}`,
        ])
      );
    case 'tuple':
      return md.paragraphs(
        md.italic(
          `Tuple, array of ${model.items.length}${model.rest ? '+' : ''} items:`
        ),
        md.list.ordered(
          model.items.map(item => formatModelOrRef(item, transformName))
        ),
        model.rest &&
          md.italic(
            `... followed by variable number of ${formatModelOrRef(
              model.rest,
              transformName
            )} items.`
          )
      );
    case 'function':
      return md.paragraphs(
        md.italic('Function.'),
        md.italic('Parameters:'),
        model.parameters.length > 0
          ? md.list.ordered(
              model.parameters.map(param =>
                formatModelOrRef(param, transformName)
              )
            )
          : md.list.unordered([md.italic('none')]),
        md.italic('Returns:'),
        md.list.unordered([formatModelOrRef(model.returnValue, transformName)])
      );
    case 'promise':
      return `${md.italic('Promise, resolves to value:')} ${formatModelOrRef(
        model.resolvedValue,
        transformName
      )}`;
    case 'literal':
      return md.italic(
        `Literal ${md.code.inline(formatLiteral(model.value))} value.`
      );
    case 'string':
    case 'number':
    case 'bigint':
      if (model.validations?.length) {
        return md.italic(
          `${capitalize(model.type)} which ${smartJoin(
            model.validations.map((validation): string => {
              if (typeof validation === 'string') {
                switch (validation) {
                  case 'email':
                  case 'emoji':
                    return `is an ${validation}`;
                  case 'url':
                  case 'uuid':
                  case 'cuid':
                  case 'cuid2':
                  case 'ulid':
                    return `is a valid ${validation.toUpperCase()}`;
                  case 'int':
                    return 'is an integer';
                  case 'finite':
                    return 'is finite';
                  case 'safe':
                    return `is safe (i.e. between ${md.code.inline(
                      'Number.MIN_SAFE_INTEGER'
                    )} and ${md.code.inline('Number.MAX_SAFE_INTEGER')})`;
                }
              }
              const [kind, value] = validation;
              switch (kind) {
                // string
                case 'min':
                case 'max':
                  return `has a ${kind}imum length of ${value}`;
                case 'length':
                  return `has an exact length of ${value}`;
                case 'regex':
                  return `matches the regular expression ${md.code.inline(
                    value.toString()
                  )}`;
                case 'includes':
                  return `includes the substring "${value}"`;
                case 'startsWith':
                  return `starts with "${value}"`;
                case 'endsWith':
                  return `ends with "${value}"`;
                case 'datetime':
                  return `is a date and time in ISO 8601 format (${[
                    value.offset ? 'UTC' : 'any timezone offset',
                    ...(value.precision != null
                      ? [
                          `sub-second precision of ${value.precision} decimal places`,
                        ]
                      : []),
                  ].join(',')})`;
                case 'ip':
                  return `is in IP${value.version ?? ''} address format`;
                // number or bigint
                case 'gt':
                  return `is greater than ${value}`;
                case 'gte':
                  return `is greater than or equal to ${value}`;
                case 'lt':
                  return `is less than ${value}`;
                case 'lte':
                  return `is less than or equal to ${value}`;
                case 'multipleOf':
                  return value === 2 ? 'is even' : `is a multiple of ${value}`;
              }
            }),
            'and'
          )}.`
        );
      }
    case 'boolean':
    case 'date':
    case 'symbol':
    case 'null':
    case 'undefined':
      return md.italic(`${capitalize(model.type)}.`);
    case 'unknown':
    case 'any':
    case 'void':
    case 'never':
      return md.italic(`${capitalize(model.type)} type.`);
  }
}

function metaFromModelOrRef(modelOrRef: ModelOrRef): ModelMeta {
  return modelOrRef.kind === 'model' ? modelOrRef.model : modelOrRef.ref;
}

function metaToSuffix(meta: ModelMeta): string {
  const addon = smartJoin(
    (['optional', 'nullable', 'readonly'] as const).filter(key => meta[key]),
    '&'
  );
  return addon ? ` (${md.italic(addon)})` : '';
}

function formatModelOrRef(
  modelOrRef: ModelOrRef,
  transformName: NameTransformFn
): string {
  const meta = metaFromModelOrRef(modelOrRef);
  const suffix = metaToSuffix(meta);

  if (modelOrRef.kind === 'ref') {
    return formatRefLink(modelOrRef.ref, transformName) + suffix;
  }
  return formatModelInline(modelOrRef.model, transformName) + suffix;
}

function formatRefLink(ref: Ref, transformName: NameTransformFn): string {
  const name = transformName(ref.name, ref.path);
  const href = `#${slugify(name)}`;
  return md.link(href, name);
}

function formatModelInline(
  model: Model,
  transformName: NameTransformFn
): string {
  switch (model.type) {
    case 'array':
      // TODO: un-duplicate
      const lengthPrefix = model.validations?.length
        ? smartJoin(
            model.validations.map(([key, value]): string => {
              switch (key) {
                case 'min':
                  return `at least ${value}`;
                case 'max':
                  return `at most ${value}`;
                case 'length':
                  return `exactly ${value}`;
              }
            }),
            ' and '
          ) + ' '
        : '';
      const isPlural =
        model.validations?.every(([, value]) => value === 1) ?? true;

      if (model.items.kind === 'ref') {
        return md.italic(
          `Array of ${lengthPrefix}${formatRefLink(
            model.items.ref,
            transformName
          )} ${isPlural ? 'items' : 'item'}`
        );
      }
      if (model.items.model.type === 'object') {
        return md.paragraphs(
          md.italic(
            `Array of ${lengthPrefix}${isPlural ? 'objects' : 'object'}:`
          ),
          formatModelInline(model.items.model, transformName).replace(
            /^_[^_]+_/,
            ''
          )
        );
      }
      const itemType = stripCode(
        formatModelInline(model.items.model, transformName)
      );
      return (
        md.code.inline(`Array<${itemType}>`) +
        (model.validations?.length
          ? ` (${md.italic(
              model.validations
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')
            )})`
          : '')
      );
    case 'object':
      return (
        md.italic('Object with properties:') +
        md.list.html.unordered(
          model.fields.map(field => {
            const formattedType = formatModelOrRef(field, transformName);
            const { description } = metaFromModelOrRef(field);
            const formattedDescription = description ? ` - ${description}` : '';
            return `${field.required ?  `${md.bold(md.code.inline(field.key))} (\\*)` :   md.code.inline(
              field.key
            )}: ${formattedType}${formattedDescription}`;
          })
        )
      );
    case 'enum':
      return md.code.inline(
        model.values
          .slice(0, MAX_VALUES)
          .map(value => `'${value}'`)
          .concat(model.values.length > MAX_VALUES ? ['...'] : [])
          .join(' | ')
      );
    case 'native-enum':
      return (
        md.italic('Native enum:') +
        md.list.html.unordered(
          nativeEnumEntries(model.enum).map(([key, value]) =>
            md.code.inline(`${key} = ${formatLiteral(value)}`)
          )
        )
      );
    case 'union':
      const formattedOptions = model.options.map(option =>
        formatModelOrRef(option, transformName)
      );
      if (formattedOptions.every(isCode)) {
        return md.code.inline(formattedOptions.map(stripCode).join(' | '));
      }
      return smartJoin(formattedOptions, md.italic('or'));
    case 'intersection':
      const formattedParts = model.parts.map(part =>
        formatModelOrRef(part, transformName)
      );
      if (formattedParts.every(isCode)) {
        return md.code.inline(formattedParts.map(stripCode).join(' & '));
      }
      return smartJoin(formattedParts, md.italic('and'));
    case 'record':
      const formattedKey = formatModelOrRef(model.keys, transformName);
      const formattedValue = formatModelOrRef(model.values, transformName);
      if (isCode(formattedKey) && isCode(formattedValue)) {
        return md.code.inline(
          `Record<${stripCode(formattedKey)}, ${stripCode(formattedValue)}>`
        );
      }
      return `${md.italic(
        'Object with dynamic keys of type'
      )} ${formattedKey} ${md.italic('and values of type')} ${formattedValue}`;
    case 'tuple':
      const formattedItems = model.items.map(item =>
        formatModelOrRef(item, transformName)
      );
      const formattedRest =
        model.rest && formatModelOrRef(model.rest, transformName);
      if (
        formattedItems.every(isCode) &&
        (formattedRest == null || isCode(formattedRest))
      ) {
        return (
          '[' +
          [
            ...formattedItems.map(stripCode),
            ...(formattedRest ? [`...${stripCode(formattedRest)}[]`] : []),
          ].join(', ') +
          ']'
        );
      }
      return (
        md.italic('Tuple:') +
        md.list.html.ordered(formattedItems) +
        (formattedRest
          ? md.italic(`...and variable number of ${formattedRest} items`)
          : '')
      );
    case 'function':
      const formattedParameters = model.parameters.map(param =>
        formatModelOrRef(param, transformName)
      );
      const formattedReturnValue = formatModelOrRef(
        model.returnValue,
        transformName
      );
      if (formattedParameters.every(isCode) && isCode(formattedReturnValue)) {
        return md.code.inline(
          `(${formattedParameters.map(stripCode).join(', ')}) => ${stripCode(
            formattedReturnValue
          )}`
        );
      }
      return md.paragraphs(
        md.italic('Function:'),
        md.list.html.unordered([
          `${md.italic('parameters:')} ${
            formattedParameters.length > 0
              ? md.list.html.ordered(formattedParameters)
              : md.italic('none')
          }`,
          `${md.italic('returns:')} ${formattedReturnValue}`,
        ])
      );
    case 'promise':
      const formattedResolvedValue = formatModelOrRef(
        model.resolvedValue,
        transformName
      );
      if (isCode(formattedResolvedValue)) {
        return md.code.inline(`Promise<${stripCode(formattedResolvedValue)}>`);
      }
      return `${md.italic('Promise of')} ${formattedResolvedValue}`;
    case 'literal':
      return md.code.inline(formatLiteral(model.value));
    case 'date':
      return md.code.inline('Date');
    case 'string':
    case 'number':
    case 'bigint':
      if (model.validations?.length) {
        const formattedValidations = model.validations.map(
          (validation): string => {
            if (typeof validation === 'string') {
              return validation;
            }
            const [kind, value] = validation;
            switch (kind) {
              case 'gt':
                return `>${value}`;
              case 'gte':
                return `≥${value}`;
              case 'lt':
                return `<${value}`;
              case 'lte':
                return `≤${value}`;
              case 'multipleOf':
                return value === 2 ? 'even' : `multiple of ${value}`;
              case 'min':
              case 'max':
                return `${kind} length: ${value}`;
              case 'regex':
                return `${kind}: ${md.code.inline(value.toString())}`;
              case 'datetime':
                const options = [
                  value.offset ? '' : 'no timezone offset',
                  value.precision != null
                    ? `${value.precision} decimals sub-second precision`
                    : '',
                ]
                  .filter(Boolean)
                  .join(' and ');
                return options ? 'ISO 8601' : `ISO 8601 - ${options}`;
              case 'ip':
                return `IP${value.version ?? ''}`;
            }
            return `${kind}: ${value}`;
          }
        );
        return `${md.code.inline(model.type)} (${md.italic(
          formattedValidations.join(', ')
        )})`;
      }
    case 'boolean':
    case 'symbol':
    case 'null':
    case 'undefined':
    case 'unknown':
    case 'any':
    case 'void':
    case 'never':
      return md.code.inline(model.type);
  }
}

function formatLiteral(value: unknown): string {
  switch (typeof value) {
    case 'string':
      return value.includes("'")
        ? `"${value.replace(/"/g, '\\"')}"`
        : `'${value.replace(/'/g, "\\'")}'`;
    case 'number':
    case 'boolean':
    case 'symbol':
    case 'bigint':
      return value.toString();
    case 'undefined':
      return 'undefined';
    case 'object':
      if (value === null) {
        return 'null';
      }
      return JSON.stringify(value);
    case 'function':
      return value.toString();
  }
}

function nativeEnumEntries(enumObj: EnumLike): [string, string | number][] {
  const numbers = Object.values(enumObj).filter(
    value => typeof value === 'number'
  );
  const strings = Object.values(enumObj).filter(
    value => typeof value === 'string'
  );
  if (
    numbers.length === strings.length &&
    numbers.every(num => typeof enumObj[num] === 'string') &&
    strings.every(str => typeof enumObj[str] === 'number')
  ) {
    return Object.entries(enumObj).filter(
      ([, value]) => typeof value === 'number'
    );
  }
  return Object.entries(enumObj);
}

function isCode(markdown: string): boolean {
  return markdown.startsWith('`') && markdown.endsWith('`');
}

function stripCode(markdown: string): string {
  return markdown.replace(/`/g, '');
}

function slugify(text: string): string {
  return text
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

function smartJoin(items: string[], sep: string): string {
  return items.reduce((acc, item, idx) => {
    const link = idx === 0 ? '' : idx === items.length - 1 ? ` ${sep} ` : ', ';
    return acc + link + item;
  }, '');
}

function capitalize<T extends string>(text: T) {
  return `${text[0]?.toUpperCase() ?? ''}${text.slice(1)}` as Capitalize<T>;
}

function uncapitalize<T extends string>(text: T) {
  return `${text[0]?.toLowerCase() ?? ''}${text.slice(1)}` as Uncapitalize<T>;
}
