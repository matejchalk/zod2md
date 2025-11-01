import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import type { $ZodType } from 'zod/v4/core';
import type { IModel } from '../types';
import { formatLiteral } from '../utils';

export class NativeEnumModel implements IModel<z3.ZodNativeEnum<z3.EnumLike>> {
  isSchema(schema: z3.ZodTypeAny | $ZodType) {
    return schema instanceof z3.ZodNativeEnum;
  }

  renderBlock<T extends z3.EnumLike>(schema: z3.ZodNativeEnum<T>): BlockText {
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

  renderInline<T extends z3.EnumLike>(schema: z3.ZodNativeEnum<T>): InlineText {
    return [
      md.italic('Native enum:'),
      md.list(
        this.#listEntries(schema).map(([key, value]) =>
          md.code(`${key} = ${formatLiteral(value)}`)
        )
      ),
    ];
  }

  #listEntries<T extends z3.EnumLike>(
    schema: z3.ZodNativeEnum<T>
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
