import { ZodType } from 'zod';
import type { ExportedSchema } from '../types';
import type { ImportedModules } from './types';

export function findZodSchemas(modules: ImportedModules): ExportedSchema[] {
  return Object.entries(modules).flatMap(([path, mod]) => {
    if (mod instanceof ZodType) {
      return [{ schema: mod, path }];
    }
    return Object.entries(mod)
      .filter(
        (pair): pair is [string, ZodType<unknown>] => pair[1] instanceof ZodType
      )
      .map(
        ([name, schema]): ExportedSchema => ({
          ...(name !== 'default' && { name }),
          schema,
          path,
        })
      );
  });
}
