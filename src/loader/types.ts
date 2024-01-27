import type { ZodType } from 'zod';

export type LoaderOptions = {
  entry: string | string[];
  tsconfig?: string;
  format?: 'esm' | 'cjs';
};

export type ImportedModules = {
  [path: string]: object;
};

export type ExportedSchema = {
  name?: string;
  schema: ZodType<unknown>;
  path: string;
};
