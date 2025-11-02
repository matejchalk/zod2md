import type * as z3 from 'zod/v3';
import type * as z4 from 'zod/v4/core';
import type { IModel } from '../types';
import { ArrayModel } from './array';
import { BigIntModel } from './bigint';
import { BooleanModel } from './boolean';
import { EnumModel } from './enum';
import { IntersectionModel } from './intersection';
import { NativeEnumModel } from './native-enum';
import { NumberModel } from './number';
import { ObjectModel } from './object';
import { StringModel } from './string';
import { UnionModel } from './union';
import { LiteralModel } from './literal';

export const MODELS: IModel<z4.$ZodType | z3.ZodTypeAny>[] = [
  new ObjectModel(),
  new ArrayModel(),
  new StringModel(),
  new NumberModel(),
  new BooleanModel(),
  new EnumModel(),
  new UnionModel(),
  new IntersectionModel(),
  new LiteralModel(),
  new BigIntModel(),
  new NativeEnumModel(),
];
