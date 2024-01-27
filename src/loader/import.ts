import { bundleRequire } from 'bundle-require';
import path from 'node:path';
import type { ImportedModules, LoaderOptions } from './types';
import { groupPromiseResultsByStatus } from './utils';

export async function importModules(
  options: LoaderOptions
): Promise<ImportedModules> {
  const entries = Array.isArray(options.entry)
    ? options.entry
    : [options.entry];

  const results = await Promise.allSettled(
    entries.map(async entry => {
      const { mod } = await bundleRequire<unknown>({
        filepath: entry,
        tsconfig: options.tsconfig,
        format: options.format,
      });

      if (typeof mod !== 'object' || mod === null) {
        throw new Error('Expected module exports to be an object');
      }

      return [path, mod] as const;
    })
  );

  const { fulfilled, rejected } = groupPromiseResultsByStatus(results);

  rejected.forEach(reason => {
    console.warn('Failed to load entry point', reason);
  });
  if (fulfilled.length === 0) {
    throw new Error('Failed to load any entry point');
  }

  return Object.fromEntries(fulfilled);
}
