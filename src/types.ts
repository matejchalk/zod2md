import type { EnumLike, ZodType, z } from 'zod';
import type { FormatterOptions } from './formatter';
import type { LoaderOptions } from './loader';

export type Options = LoaderOptions & FormatterOptions;

export type Config = Options & { output: string };

export type ExportedSchema = {
  name?: string;
  schema: ZodType<unknown>;
  path: string;
};

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type NamedModel = Model & Ref;

export type Model = (
  | ArrayModel
  | ObjectModel
  | StringModel
  | NumberModel
  | BooleanModel
  | DateModel
  | EnumModel
  | NativeEnumModel
  | UnionModel
  | IntersectionModel
  | RecordModel
  | TupleModel
  | FunctionModel
  | PromiseModel
  | LiteralModel
  | NullModel
  | UndefinedModel
  | SymbolModel
  | BigIntModel
  | UnknownModel
  | AnyModel
  | VoidModel
  | NeverModel
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
  readonly?: boolean;
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

export type NativeEnumModel = {
  type: 'native-enum';
  enum: EnumLike;
};

export type UnionModel = {
  type: 'union';
  options: ModelOrRef[];
};

export type IntersectionModel = {
  type: 'intersection';
  parts: [ModelOrRef, ModelOrRef];
};

export type RecordModel = {
  type: 'record';
  keys: ModelOrRef;
  values: ModelOrRef;
};

export type TupleModel = {
  type: 'tuple';
  items: ModelOrRef[];
  rest?: ModelOrRef;
};

export type FunctionModel = {
  type: 'function';
  parameters: ModelOrRef[];
  returnValue: ModelOrRef;
};

export type PromiseModel = {
  type: 'promise';
  resolvedValue: ModelOrRef;
};

export type LiteralModel = {
  type: 'literal';
  value: z.Primitive;
};

export type NullModel = {
  type: 'null';
};

export type UndefinedModel = {
  type: 'undefined';
};

export type SymbolModel = {
  type: 'symbol';
};

export type BigIntModel = {
  type: 'bigint';
};

export type UnknownModel = {
  type: 'unknown';
};

export type AnyModel = {
  type: 'any';
};

export type VoidModel = {
  type: 'void';
};

export type NeverModel = {
  type: 'never';
};
