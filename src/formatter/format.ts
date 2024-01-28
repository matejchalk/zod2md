import type { FormatterOptions } from '.';
import type { Model, ModelOrRef, NamedModel } from '../types';
import * as md from './markdown';
import { defaultNameTransform } from './name-transform';
import type { NameTransformFn } from './types';

export function formatModelsAsMarkdown(
  models: NamedModel[],
  options: FormatterOptions
): string {
  const { title, transformName = defaultNameTransform } = options;
  return md.paragraphs(
    md.heading(1, title),
    ...models.flatMap(model => [
      md.heading(2, transformName(model.name, model.path)),
      formatModel(model, transformName),
    ])
  );
}

function formatModel(model: Model, transformName: NameTransformFn): string {
  switch (model.type) {
    case 'array':
      return `array of ${formatModelOrRef(model.items, transformName)} items`;
    case 'object':
      return md.paragraphs(
        'object containing the following properties:',
        md.table(
          model.fields.map(field => [
            md.code.inline(field.key),
            field.required ? 'yes' : 'no',
            formatModelOrRef(field, transformName),
          ]),
          ['Property', 'Required?', 'Type'],
          ['left', 'center', 'left']
        )
      );
    case 'enum':
      return md.paragraphs(
        'enum string, one of the following possible values:',
        md.list.unordered(
          model.values.map(value => md.code.inline(`"${value}"`))
        )
      );
    case 'literal':
      return `literal ${md.code.inline(
        typeof model.value === 'symbol'
          ? model.value.toString()
          : `${model.value}`
      )} value`;
    case 'unknown':
      return 'unknown type';
    default:
      return model.type;
  }
}

function formatModelOrRef(
  modelOrRef: ModelOrRef,
  transformName: NameTransformFn
): string {
  if (modelOrRef.kind === 'ref') {
    const { ref } = modelOrRef;
    const name = transformName(ref.name, ref.path);
    const href = `#${slugify(name)}`;
    return md.link(href, name);
  }
  const { model } = modelOrRef;
  switch (model.type) {
    case 'enum':
      return model.values.map(value => md.code.inline(`"${value}"`)).join('/');
    default:
      return formatModel(model, transformName);
  }
}

function slugify(text: string): string {
  return text
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}
