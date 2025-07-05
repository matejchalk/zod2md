import { z } from 'zod/v4';
import type { $ZodFunction } from 'zod/v4/core';

export function convertZodFunctionToSchema<T extends $ZodFunction>(factory: T) {
  return z
    .custom()
    .transform((arg, ctx) => {
      if (typeof arg !== 'function') {
        ctx.addIssue('Must be a function');
        return z.NEVER;
      }
      return factory.implement(arg as Parameters<T['implement']>[0]);
    })
    .meta({ $ZodFunction: factory });
}
