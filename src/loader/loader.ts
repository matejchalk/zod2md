import type { ExportedSchema } from '../types';
import { findZodSchemas } from './find-schemas';
import { importModules } from './import';
import type { LoaderOptions } from './types';

export async function loadZodSchemas(options: LoaderOptions): ExportedSchema[] {
  const modules = await importModules(options);
  return findZodSchemas(modules);
}
