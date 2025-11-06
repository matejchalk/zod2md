import type * as z3 from 'zod/v3';
import type * as z4 from 'zod/v4/core';
import type { IModel } from '../types';
import { AnyModel } from './any';
import { ArrayModel } from './array';
import { BigIntModel } from './bigint';
import { BooleanModel } from './boolean';
import { BrandedModel } from './branded';
import { CatchModel } from './catch';
import { DateModel } from './date';
import { DefaultModel } from './default';
import { EffectsModel } from './effects';
import { EnumModel } from './enum';
import { FunctionModel } from './function';
import { IntersectionModel } from './intersection';
import { LazyModel } from './lazy';
import { LiteralModel } from './literal';
import { NativeEnumModel } from './native-enum';
import { NeverModel } from './never';
import { NonOptionalModel } from './non-optional';
import { NullableModel } from './nullable';
import { NumberModel } from './number';
import { ObjectModel } from './object';
import { OptionalModel } from './optional';
import { PipeModel } from './pipe';
import { ReadonlyModel } from './readonly';
import { RecordModel } from './record';
import { StringModel } from './string';
import { SymbolModel } from './symbol';
import { UnionModel } from './union';
import { UnknownModel } from './unknown';
import { VoidModel } from './void';

export const MODELS: IModel<z4.$ZodType | z3.ZodTypeAny>[] = [
  new ObjectModel(),
  new ArrayModel(),
  new StringModel(),
  new NumberModel(),
  new BooleanModel(),
  new EnumModel(),
  new DateModel(),
  new OptionalModel(),
  new NullableModel(),
  new DefaultModel(),
  new UnionModel(),
  new IntersectionModel(),
  new RecordModel(),
  new LiteralModel(),
  new FunctionModel(),
  new ReadonlyModel(),
  new SymbolModel(),
  new BigIntModel(),
  new PipeModel(),
  new LazyModel(),
  new CatchModel(),
  new UnknownModel(),
  new AnyModel(),
  new VoidModel(),
  new NeverModel(),
  // v4 only
  new NonOptionalModel(),
  // v3 only
  new NativeEnumModel(),
  new EffectsModel(),
  new BrandedModel(),
];
