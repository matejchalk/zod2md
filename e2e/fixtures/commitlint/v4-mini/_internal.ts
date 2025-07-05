import { z } from 'zod/v4-mini';
import type { $ZodFunction } from 'zod/v4/core';

export function convertZodFunctionToSchema<T extends $ZodFunction>(factory: T) {
  return z
    .transform((arg, payload) => {
      if (typeof arg !== 'function') {
        payload.issues.push({
          input: payload.value,
          code: 'custom',
          message: 'Must be a function',
        });
        return z.never();
      }
      return factory.implement(arg as Parameters<T['implement']>[0]);
    })
    .register(z.globalRegistry, { $ZodFunction: factory });
}
