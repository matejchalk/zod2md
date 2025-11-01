import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import type { $ZodType } from 'zod/v4/core';
import { formatLiteral } from '../formatting-utils';
import type { IModel } from '../types';

export class NativeEnumModel implements IModel<z3.ZodNativeEnum<z3.EnumLike>> {
  isSchema(schema: z3.ZodTypeAny | $ZodType) {
    return schema instanceof z3.ZodNativeEnum;
  }

  renderBlock(schema: z3.ZodNativeEnum<z3.EnumLike>): BlockText {
    return [
      md.italic('Native enum:'),
      md.table(
        ['Key', 'Value'],
        this.#listEntries(schema).map(([key, value]) => [
          md.code(key),
          md.code(formatLiteral(value)),
        ])
      ),
    ];
  }

  renderInline(schema: z3.ZodNativeEnum<z3.EnumLike>): InlineText {
    return [
      md.italic('Native enum:'),
      md.list(
        this.#listEntries(schema).map(([key, value]) =>
          md.code(`${key} = ${formatLiteral(value)}`)
        )
      ),
    ];
  }

  #listEntries(
    schema: z3.ZodNativeEnum<z3.EnumLike>
  ): [string, string | number][] {
    const numbers = Object.values(schema.enum).filter(
      value => typeof value === 'number'
    );
    const strings = Object.values(schema.enum).filter(
      value => typeof value === 'string'
    );
    if (
      numbers.length === strings.length &&
      numbers.every(num => typeof schema.enum[num] === 'string') &&
      strings.every(str => typeof schema.enum[str] === 'number')
    ) {
      return Object.entries(schema.enum).filter(
        ([, value]) => typeof value === 'number'
      );
    }
    return Object.entries(schema.enum);
  }
}
