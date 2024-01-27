import { findZodSchemas } from './find-schemas';
import { importModules } from './import';
import type { LoaderOptions } from './types';

export async function loadZodSchemas(options: LoaderOptions) {
  const modules = await importModules(options);
  findZodSchemas(modules);
  // TODO ...
}
