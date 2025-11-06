import { formatSchemasAsMarkdown } from './formatter';
import { loadZodSchemas } from './loader';
import type { Options } from './types';

export async function zod2md(options: Options): Promise<string> {
  const schemas = await loadZodSchemas(options);
  return formatSchemasAsMarkdown(schemas, options);
}

export { formatSchemasAsMarkdown };

export type { Config, Options } from './types';
