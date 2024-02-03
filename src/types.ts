import type { ZodType, z } from 'zod';
import type { FormatterOptions } from './formatter';
import type { LoaderOptions } from './loader';

export type Options = LoaderOptions & FormatterOptions;

export type ExportedSchema = {
  name?: string;
  schema: ZodType<unknown>;
  path: string;
};

export type NamedModel = Model & Ref;

export type Model = (
  | ArrayModel
  | ObjectModel
  | StringModel
  | NumberModel
  | BooleanModel
  | DateModel
  | EnumModel
  | LiteralModel
  | UnknownModel
  | UnionModel
) &
  ModelMeta;

export type Ref = {
  name?: string;
  path: string;
} & ModelMeta;

export type ModelMeta = {
  description?: string;
  default?: unknown;
  optional?: boolean;
  nullable?: boolean;
};

export type ModelOrRef =
  | { kind: 'model'; model: Model }
  | { kind: 'ref'; ref: Ref };

export type ArrayModel = {
  type: 'array';
  items: ModelOrRef;
};

export type ObjectModel = {
  type: 'object';
  fields: ({
    key: string;
    required: boolean;
  } & ModelOrRef)[];
};

export type StringModel = {
  type: 'string';
};

export type NumberModel = {
  type: 'number';
};

export type BooleanModel = {
  type: 'boolean';
};

export type DateModel = {
  type: 'date';
};

export type EnumModel = {
  type: 'enum';
  values: string[];
};

export type LiteralModel = {
  type: 'literal';
  value: z.Primitive;
};

export type UnknownModel = {
  type: 'unknown';
};

export type UnionModel = {
  type: 'union';
  options: ModelOrRef[];
};
