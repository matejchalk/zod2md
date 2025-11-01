import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';
import { formatLiteral } from '../utils';

const MAX_VALUES = 20;

export class EnumModel
  implements IModel<z3.ZodEnum<[string, ...string[]]> | z4.$ZodEnum>
{
  isSchema(schema: z3.ZodTypeAny | z4.$ZodType) {
    return schema instanceof z3.ZodEnum || schema instanceof z4.$ZodEnum;
  }

  renderBlock(
    schema: z3.ZodEnum<[string, ...string[]]> | z4.$ZodEnum
  ): BlockText {
    const values = this.#listValues(schema);
    const listItems = values.map(value => md.code(formatLiteral(value)));

    return [
      md.italic('Enum, one of the following possible values:'),
      values.length > MAX_VALUES
        ? md.details(
            md.italic(`Expand for full list of ${values.length} values`),
            md.list(listItems)
          )
        : md.list(listItems),
    ];
  }

  renderInline(
    schema: z3.ZodEnum<[string, ...string[]]> | z4.$ZodEnum
  ): InlineText {
    const values = this.#listValues(schema);
    return md.code(
      values
        .slice(0, MAX_VALUES)
        .map(formatLiteral)
        .concat(values.length > MAX_VALUES ? ['...'] : [])
        .join(' | ')
    );
  }

  #listValues(
    schema: z3.ZodEnum<[string, ...string[]]> | z4.$ZodEnum
  ): z4.util.EnumValue[] {
    if (schema instanceof z4.$ZodEnum) {
      return Object.values(schema._zod.def.entries);
    }
    return schema._def.values;
  }
}
