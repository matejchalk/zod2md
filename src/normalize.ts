import type { ExportedSchema, ExportedSchemas } from './types';

export function normalizeExportedSchemas(
  exportedSchemas: ExportedSchemas
): ExportedSchema[] {
  if (Array.isArray(exportedSchemas)) {
    return exportedSchemas;
  }
  return Object.entries(exportedSchemas).map(([name, schema]) => ({
    name,
    schema,
    path: `${name}.ts`,
  }));
}
