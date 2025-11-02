import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';
import { smartJoin } from '../utils';

type BigIntValidation =
  | { kind: 'gte'; value: bigint }
  | { kind: 'gt'; value: bigint }
  | { kind: 'lte'; value: bigint }
  | { kind: 'lt'; value: bigint }
  | { kind: 'multipleOf'; value: bigint };

export class BigIntModel implements IModel<z4.$ZodBigInt | z3.ZodBigInt> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodBigInt || schema instanceof z3.ZodBigInt;
  }

  renderBlock(schema: z4.$ZodBigInt | z3.ZodBigInt): BlockText {
    const validations = this.#listValidations(schema);
    if (validations.length === 0) {
      return md.italic('BigInt.');
    }
    return md.italic(
      `BigInt that ${smartJoin(
        validations.map(this.#formatValidationLong),
        'and'
      )}.`
    );
  }

  renderInline(schema: z4.$ZodBigInt | z3.ZodBigInt): InlineText {
    const validations = this.#listValidations(schema);
    if (validations.length === 0) {
      return md.code('bigint');
    }
    return md`${md.code('bigint')} (${md.italic(
      validations.map(this.#formatValidationShort).join(', ')
    )})`;
  }

  #formatValidationLong(validation: BigIntValidation): string {
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
        return validation.value === 2n
          ? 'is even'
          : `is a multiple of ${validation.value}`;
    }
  }

  #formatValidationShort(validation: BigIntValidation): string {
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
        return validation.value === 2n
          ? 'even'
          : `multiple of ${validation.value}`;
    }
  }

  #listValidations(schema: z4.$ZodBigInt | z3.ZodBigInt): BigIntValidation[] {
    if (schema instanceof z3.ZodBigInt) {
      return schema._def.checks.map((check): BigIntValidation => {
        switch (check.kind) {
          case 'min':
            return { kind: check.inclusive ? 'gte' : 'gt', value: check.value };
          case 'max':
            return { kind: check.inclusive ? 'lte' : 'lt', value: check.value };
          case 'multipleOf':
            return { kind: check.kind, value: check.value };
        }
      });
    }

    return (
      schema._zod.def.checks
        ?.map((check): BigIntValidation | null => {
          if (check instanceof z4.$ZodCheckGreaterThan) {
            return {
              kind: check._zod.def.inclusive ? 'gte' : 'gt',
              value: BigInt(check._zod.def.value.valueOf()),
            };
          }
          if (check instanceof z4.$ZodCheckLessThan) {
            return {
              kind: check._zod.def.inclusive ? 'lte' : 'lt',
              value: BigInt(check._zod.def.value.valueOf()),
            };
          }
          if (check instanceof z4.$ZodCheckMultipleOf) {
            return { kind: 'multipleOf', value: BigInt(check._zod.def.value) };
          }
          return null;
        })
        .filter(validation => validation != null) ?? []
    );
  }
}
