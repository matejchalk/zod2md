import type * as z3 from 'zod/v3';
import type * as z4 from 'zod/v4/core';
import type { IModel } from '../types';
import { ArrayModel } from './array';
import { BigIntModel } from './bigint';
import { BooleanModel } from './boolean';
import { EnumModel } from './enum';
import { NativeEnumModel } from './native-enum';
import { NumberModel } from './number';
import { ObjectModel } from './object';
import { StringModel } from './string';

export const MODELS: IModel<z3.ZodTypeAny | z4.$ZodType>[] = [
  new ObjectModel(),
  new ArrayModel(),
  new StringModel(),
  new NumberModel(),
  new BooleanModel(),
  new EnumModel(),
  new BigIntModel(),
  new NativeEnumModel(),
];
