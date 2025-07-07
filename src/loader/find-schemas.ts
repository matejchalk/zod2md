import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { ExportedSchema } from '../types';
import type { ImportedModules } from './types';

export function findZodSchemas(modules: ImportedModules): ExportedSchema[] {
  return Object.entries(modules).flatMap(([path, mod]) => {
    if (mod instanceof z3.ZodType || mod instanceof z4.$ZodType) {
      return [{ schema: mod, path }];
    }
    return Object.entries(mod)
      .filter(
        (pair): pair is [string, z3.ZodType<unknown> | z4.$ZodType] =>
          pair[1] instanceof z3.ZodType || pair[1] instanceof z4.$ZodType
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
