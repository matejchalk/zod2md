import type { EnumLike } from 'zod';
import type { FormatterOptions } from '.';
import type { Model, ModelMeta, ModelOrRef, NamedModel, Ref } from '../types';
import * as md from './markdown';
import { defaultNameTransform } from './name-transform';
import type { NameTransformFn } from './types';

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
      return md.italic(
        `Array of ${formatModelOrRef(model.items, transformName)} items.`
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
              formatModelOrRef(field, transformName),
              ...(hasDefault
                ? [
                    'default' in meta
                      ? md.code.inline(formatLiteral(meta.default))
                      : '-',
                  ]
                : []),
              ...(hasDescription ? [meta.description ?? ''] : []),
            ];
          }),
          [
            'Property',
            'Type',
            ...(hasDefault ? ['Default'] : []),
            ...(hasDescription ? ['Description'] : []),
          ]
        ),
        md.italic(
          model.fields.some(({ required }) => required)
            ? '(\\*) Required.'
            : 'All properties are optional.'
        )
      );
    case 'enum':
      return md.paragraphs(
        md.italic('Enum string, one of the following possible values:'),
        md.list.unordered(
          model.values.map(value => md.code.inline(`'${value}'`))
        )
      );
    case 'native-enum':
      return md.paragraphs(
        'Native enum:',
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
          `${md.italic('keys:')} ${formatModelOrRef(
            model.keys,
            transformName
          )}`,
          `${md.italic('values:')} ${formatModelOrRef(
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
    case 'boolean':
    case 'date':
    case 'symbol':
    case 'bigint':
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
  const addon = (['optional', 'nullable', 'readonly'] as const)
    .filter(key => meta[key])
    .join(' & ');
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
      if (model.items.kind === 'ref') {
        return md.italic(
          `Array of ${formatRefLink(model.items.ref, transformName)} items`
        );
      }
      if (model.items.model.type === 'object') {
        return md.paragraphs(
          md.italic('Array of objects:'),
          formatModelInline(model.items.model, transformName).replace(
            /^_[^_]+_/,
            ''
          )
        );
      }
      const itemType = stripCode(
        formatModelInline(model.items.model, transformName)
      );
      return md.code.inline(`Array<${itemType}>`);
    case 'object':
      return (
        md.italic('Object:') +
        md.list.html.unordered(
          model.fields.map(field => {
            const formattedType = formatModelOrRef(field, transformName);
            const { description } = metaFromModelOrRef(field);
            const formattedDescription = description ? ` - ${description}` : '';
            return `${md.code.inline(
              field.key
            )}: ${formattedType}${formattedDescription}`;
          })
        )
      );
    case 'enum':
      return md.code.inline(
        model.values.map(value => `'${value}'`).join(' | ')
      );
    case 'native-enum':
      return (
        md.italic('Native enum: ') +
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
      return smartJoin(formattedOptions, 'or');
    case 'intersection':
      const formattedParts = model.parts.map(part =>
        formatModelOrRef(part, transformName)
      );
      if (formattedParts.every(isCode)) {
        return md.code.inline(formattedParts.map(stripCode).join(' & '));
      }
      return smartJoin(formattedParts, 'and');
    case 'record':
      const formattedKey = formatModelOrRef(model.keys, transformName);
      const formattedValue = formatModelOrRef(model.values, transformName);
      if (isCode(formattedKey) && isCode(formattedValue)) {
        return md.code.inline(
          `Record<${stripCode(formattedKey)}, ${stripCode(formattedValue)}>`
        );
      }
      return md.italic(
        `Object with ${formattedKey} keys and values of type ${formattedValue}`
      );
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
      return `${md.italic('Promise of ')} ${formattedResolvedValue}`;
    case 'literal':
      return md.code.inline(formatLiteral(model.value));
    case 'date':
      return md.code.inline('Date');
    case 'boolean':
    case 'string':
    case 'number':
    case 'symbol':
    case 'bigint':
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

function smartJoin(items: string[], sep: 'and' | 'or'): string {
  return items.reduce((acc, item, idx) => {
    const link = idx === items.length - 1 ? ` ${sep} ` : idx === 0 ? '' : ', ';
    return acc + link + item;
  }, '');
}

function capitalize<T extends string>(text: T) {
  return `${text[0]?.toUpperCase() ?? ''}${text.slice(1)}` as Capitalize<T>;
}

function uncapitalize<T extends string>(text: T) {
  return `${text[0]?.toLowerCase() ?? ''}${text.slice(1)}` as Uncapitalize<T>;
}
