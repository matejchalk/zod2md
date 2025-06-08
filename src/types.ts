import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4';
import type { FormatterOptions } from './formatter';
import type { LoaderOptions } from './loader';

export type Options = LoaderOptions & FormatterOptions;

export type Config = Options & { output: string };

export type ExportedSchema = {
  name?: string;
  schema: z3.ZodType<unknown> | z4.ZodType;
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
  validations?: ArrayValidation[];
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
  validations?: StringValidation[];
};

export type NumberModel = {
  type: 'number';
  validations?: NumberValidation[];
};

export type BooleanModel = {
  type: 'boolean';
};

export type DateModel = {
  type: 'date';
};

export type EnumModel = {
  type: 'enum';
  values: (string | number)[];
};

export type NativeEnumModel = {
  type: 'native-enum';
  enum: z3.EnumLike;
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
  value: z3.Primitive | z4.core.util.Primitive;
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
  validations?: BigIntValidation[];
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

export type ArrayValidation =
  | ['min', number]
  | ['max', number]
  | ['length', number];

export type StringValidation =
  | ['min', number]
  | ['max', number]
  | ['length', number]
  | 'email'
  | 'url'
  | 'emoji'
  | 'uuid'
  | 'cuid'
  | 'cuid2'
  | 'ulid'
  | 'nanoid'
  | 'base64'
  | 'base64url'
  | 'jwt'
  | 'date'
  | 'time'
  | 'duration'
  | ['regex', RegExp]
  | ['includes', string]
  | ['startsWith', string]
  | ['endsWith', string]
  | ['datetime', { offset: boolean; precision: number | null }]
  | ['ip', { version?: 'v4' | 'v6' }]
  | ['cidr', { version?: 'v4' | 'v6' }];

export type NumberValidation =
  | ['gt', number]
  | ['gte', number]
  | ['lt', number]
  | ['lte', number]
  | 'int'
  | ['multipleOf', number]
  | 'finite'
  | 'safe'
  | 'safeint'
  | 'int32'
  | 'uint32'
  | 'float32'
  | 'float64';

export type BigIntValidation =
  | ['gt', bigint]
  | ['gte', bigint]
  | ['lt', bigint]
  | ['lte', bigint]
  | ['multipleOf', bigint];
