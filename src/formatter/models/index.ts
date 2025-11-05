import type * as z3 from 'zod/v3';
import type * as z4 from 'zod/v4/core';
import type { IModel } from '../types';
import { ArrayModel } from './array';
import { BigIntModel } from './bigint';
import { BooleanModel } from './boolean';
import { BrandedModel } from './branded';
import { CatchModel } from './catch';
import { DefaultModel } from './default';
import { EffectsModel } from './effects';
import { EnumModel } from './enum';
import { IntersectionModel } from './intersection';
import { LazyModel } from './lazy';
import { LiteralModel } from './literal';
import { NativeEnumModel } from './native-enum';
import { NonOptionalModel } from './non-optional';
import { NullableModel } from './nullable';
import { NumberModel } from './number';
import { ObjectModel } from './object';
import { OptionalModel } from './optional';
import { PipeModel } from './pipe';
import { ReadonlyModel } from './readonly';
import { StringModel } from './string';
import { UnionModel } from './union';

export const MODELS: IModel<z4.$ZodType | z3.ZodTypeAny>[] = [
  new ObjectModel(),
  new ArrayModel(),
  new StringModel(),
  new NumberModel(),
  new BooleanModel(),
  new EnumModel(),
  new OptionalModel(),
  new NullableModel(),
  new DefaultModel(),
  new UnionModel(),
  new IntersectionModel(),
  new LiteralModel(),
  new ReadonlyModel(),
  new BigIntModel(),
  new PipeModel(),
  new LazyModel(),
  new CatchModel(),
  // v4 only
  new NonOptionalModel(),
  // v3 only
  new NativeEnumModel(),
  new EffectsModel(),
  new BrandedModel(),
];
