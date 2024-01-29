import type { z } from 'zod';
import type { FormatterOptions } from '.';
import type { Model, ModelOrRef, NamedModel, Ref } from '../types';
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
        formatModel(model, transformName),
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
      return md.paragraphs(
        md.italic('Object containing the following properties:'),
        md.table(
          model.fields.map(field => [
            field.required
              ? `${md.bold(md.code.inline(field.key))} (\\*)`
              : md.code.inline(field.key),
            formatModelOrRef(field, transformName),
            (field.kind === 'model'
              ? field.model.description
              : field.ref.description) ?? '',
          ]),
          ['Property', 'Type', 'Description']
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
    case 'literal':
      return md.italic(
        `Literal ${md.code.inline(formatLiteral(model.value))} value.`
      );
    case 'unknown':
      return md.italic('Unknown type.');
    default:
      return model.type;
  }
}

function formatModelOrRef(
  modelOrRef: ModelOrRef,
  transformName: NameTransformFn
): string {
  if (modelOrRef.kind === 'ref') {
    return formatRefLink(modelOrRef.ref, transformName);
  }
  return formatModelInline(modelOrRef.model, transformName);
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
        return `array of ${formatRefLink(
          model.items.ref,
          transformName
        )} items`;
      }
      const itemType = formatModelInline(
        model.items.model,
        transformName
      ).replace(/`/g, '');
      return md.code.inline(`Array<${itemType}>`);
    case 'object':
      throw new Error(`Inline ${model.type} formatting not yet implemented`);
    case 'enum':
      return md.code.inline(
        model.values.map(value => `'${value}'`).join(' | ')
      );
    case 'literal':
      return md.code.inline(formatLiteral(model.value));
    case 'date':
      return md.code.inline('Date');
    case 'boolean':
    case 'string':
    case 'number':
    case 'unknown':
      return md.code.inline(model.type);
  }
}

function formatLiteral(value: z.Primitive): string {
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
    case 'object':
      return 'null';
    case 'undefined':
      return 'undefined';
  }
}

function slugify(text: string): string {
  return text
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}
