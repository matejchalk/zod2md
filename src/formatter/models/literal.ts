import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4';
import type { IModel } from '../types';
import { formatLiteral } from '../utils';

export class LiteralModel
  implements IModel<z4.core.$ZodLiteral | z3.ZodLiteral<z3.Primitive>>
{
  isSchema(schema: z4.core.$ZodType | z3.ZodTypeAny) {
    return (
      schema instanceof z4.core.$ZodLiteral || schema instanceof z3.ZodLiteral
    );
  }

  renderBlock(
    schema: z4.core.$ZodLiteral | z3.ZodLiteral<z3.Primitive>
  ): BlockText {
    const value = this.#parseValue(schema);
    if (Array.isArray(value)) {
      return md`${md.italic(
        'One of the following possible literal values:'
      )}${md.list(value.map(literal => md.code(formatLiteral(literal))))}`;
    }
    return md.italic(['Literal ', md.code(formatLiteral(value)), ' value.']);
  }

  renderInline(
    schema: z4.core.$ZodLiteral | z3.ZodLiteral<z3.Primitive>
  ): InlineText {
    const value = this.#parseValue(schema);
    if (Array.isArray(value)) {
      return md.code(value.map(formatLiteral).join(' | '));
    }
    return md.code(formatLiteral(value));
  }

  #parseValue(schema: z4.core.$ZodLiteral | z3.ZodLiteral<z3.Primitive>) {
    if (schema instanceof z4.core.$ZodLiteral) {
      if (schema._zod.def.values.length === 1) {
        return schema._zod.def.values[0]!;
      }
      return schema._zod.def.values;
    }

    return schema._def.value;
  }
}
