import { MarkdownDocument } from 'build-md';
import type { ExportedSchema } from '../types';
import { MODELS } from './models';
import { defaultNameTransform } from './name-transform';
import { Renderer } from './renderer';
import type { FormatterOptions } from './types';

export function formatSchemasAsMarkdown(
  schemas: ExportedSchema[],
  options: FormatterOptions
) {
  const { title, transformName = defaultNameTransform } = options;
  const renderer = new Renderer(MODELS, schemas, transformName);

  return new MarkdownDocument()
    .heading(1, title)
    .$foreach(schemas, (doc, { name, path, schema }) =>
      doc
        .heading(2, transformName(name, path))
        .paragraph(renderer.getDescription(schema))
        .paragraph(renderer.renderSchemaBlock(schema))
    )
    .toString();
}
