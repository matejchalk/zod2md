import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { FormatterOptions } from './formatter';
import type { LoaderOptions } from './loader';

export type Options = LoaderOptions & FormatterOptions;

export type Config = Options & { output: string };

export type ExportedSchema = {
  name?: string;
  schema: z3.ZodType<unknown> | z4.$ZodType;
  path: string;
};

export type ExportedSchemas =
  | ExportedSchema[]
  | Record<string, ExportedSchema['schema']>;
