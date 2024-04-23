import { convertSchemas } from './converter';
import { formatModelsAsMarkdown } from './formatter';
import { loadZodSchemas } from './loader';
import type { Options } from './types';

export async function zod2md(options: Options): Promise<string> {
  const schemas = await loadZodSchemas(options);
  const models = convertSchemas(schemas);
  return formatModelsAsMarkdown(models, options);
}

export { convertSchemas, formatModelsAsMarkdown, loadZodSchemas }

export type { Config, Options } from './types';
