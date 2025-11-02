import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';
import { smartJoin } from '../utils';

type NumberValidation =
  | { kind: 'gte'; value: number }
  | { kind: 'gt'; value: number }
  | { kind: 'lte'; value: number }
  | { kind: 'lt'; value: number }
  | { kind: 'multipleOf'; value: number }
  | { kind: 'int' }
  | { kind: 'finite' }
  | { kind: 'safe' }
  | { kind: 'safeint' }
  | { kind: 'int32' }
  | { kind: 'uint32' }
  | { kind: 'float32' }
  | { kind: 'float64' };

export class NumberModel implements IModel<z4.$ZodNumber | z3.ZodNumber> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodNumber || schema instanceof z3.ZodNumber;
  }

  renderBlock(schema: z4.$ZodNumber | z3.ZodNumber): BlockText {
    const validations = this.#listValidations(schema);
    if (validations.length === 0) {
      return md.italic('Number.');
    }
    return md.italic(
      `Number that ${smartJoin(
        validations.map(this.#formatValidationLong),
        'and'
      )}.`
    );
  }

  renderInline(schema: z4.$ZodNumber | z3.ZodNumber): InlineText {
    const validations = this.#listValidations(schema);
    if (validations.length === 0) {
      return md.code('number');
    }
    return md`${md.code('number')} (${md.italic(
      validations.map(this.#formatValidationShort).join(', ')
    )})`;
  }

  #formatValidationLong(validation: NumberValidation): string {
    switch (validation.kind) {
      case 'gt':
        return `is greater than ${validation.value}`;
      case 'gte':
        return `is greater than or equal to ${validation.value}`;
      case 'lt':
        return `is less than ${validation.value}`;
      case 'lte':
        return `is less than or equal to ${validation.value}`;
      case 'multipleOf':
        return validation.value === 2
          ? 'is even'
          : `is a multiple of ${validation.value}`;
      case 'int':
        return 'is an integer';
      case 'finite':
        return 'is finite';
      case 'safe':
        return `is safe (i.e. between ${md.code(
          'Number.MIN_SAFE_INTEGER'
        )} and ${md.code('Number.MAX_SAFE_INTEGER')})`;
      case 'safeint':
        return `is a safe integer (i.e. between ${md.code(
          'Number.MIN_SAFE_INTEGER'
        )} and ${md.code('Number.MAX_SAFE_INTEGER')})`;
      case 'int32':
        return 'is a 32-bit integer';
      case 'uint32':
        return 'is a 32-bit unsigned integer';
      case 'float32':
        return 'is a 32-bit floating-point number';
      case 'float64':
        return 'is a 64-bit floating-point number';
    }
  }

  #formatValidationShort(validation: NumberValidation): string {
    switch (validation.kind) {
      case 'gt':
        return `>${validation.value}`;
      case 'gte':
        return `≥${validation.value}`;
      case 'lt':
        return `<${validation.value}`;
      case 'lte':
        return `≤${validation.value}`;
      case 'multipleOf':
        return validation.value === 2
          ? 'even'
          : `multiple of ${validation.value}`;
      default:
        return validation.kind;
    }
  }

  #listValidations(schema: z4.$ZodNumber | z3.ZodNumber): NumberValidation[] {
    if (schema instanceof z3.ZodNumber) {
      return schema._def.checks.map((check): NumberValidation => {
        switch (check.kind) {
          case 'min':
            return { kind: check.inclusive ? 'gte' : 'gt', value: check.value };
          case 'max':
            return { kind: check.inclusive ? 'lte' : 'lt', value: check.value };
          case 'multipleOf':
            return { kind: check.kind, value: check.value };
          case 'int':
          case 'finite':
            return { kind: check.kind };
        }
      });
    }

    return (
      schema._zod.def.checks
        ?.map((check): NumberValidation | null => {
          if (check instanceof z4.$ZodCheckGreaterThan) {
            return {
              kind: check._zod.def.inclusive ? 'gte' : 'gt',
              value: Number(check._zod.def.value),
            };
          }
          if (check instanceof z4.$ZodCheckLessThan) {
            return {
              kind: check._zod.def.inclusive ? 'lte' : 'lt',
              value: Number(check._zod.def.value),
            };
          }
          if (check instanceof z4.$ZodCheckMultipleOf) {
            return { kind: 'multipleOf', value: Number(check._zod.def.value) };
          }
          if (check instanceof z4.$ZodNumberFormat) {
            return { kind: check._zod.def.format };
          }
          return null;
        })
        .filter(validation => validation != null) ?? []
    );
  }
}
