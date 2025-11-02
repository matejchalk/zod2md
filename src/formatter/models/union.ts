import { CodeMark, md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';
import { smartJoinMd } from '../utils';

export class UnionModel
  implements
    IModel<
      z4.$ZodUnion | z3.ZodUnion<readonly [z3.ZodTypeAny, ...z3.ZodTypeAny[]]>
    >
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodUnion || schema instanceof z3.ZodUnion;
  }

  renderBlock(
    schema:
      | z4.$ZodUnion
      | z3.ZodUnion<readonly [z3.ZodTypeAny, ...z3.ZodTypeAny[]]>,
    renderer: Renderer
  ): BlockText {
    const options = this.#listOptions(schema);
    return md`${md.italic('Union of the following possible types:')}${md.list(
      options.map(option => renderer.renderSchemaInline(option))
    )}`;
  }

  renderInline(
    schema:
      | z4.$ZodUnion
      | z3.ZodUnion<readonly [z3.ZodTypeAny, ...z3.ZodTypeAny[]]>,
    renderer: Renderer
  ): InlineText {
    const options = this.#listOptions(schema);
    const formattedItems = options.map(option =>
      renderer.renderSchemaInline(option)
    );
    if (formattedItems.every(item => item instanceof CodeMark)) {
      return md.code(formattedItems.map(item => item.text).join(' | '));
    }
    return smartJoinMd(formattedItems, md.italic('or'));
  }

  #listOptions(
    schema:
      | z4.$ZodUnion
      | z3.ZodUnion<readonly [z3.ZodTypeAny, ...z3.ZodTypeAny[]]>
  ): readonly (z4.$ZodType | z3.ZodTypeAny)[] {
    return schema instanceof z4.$ZodUnion
      ? schema._zod.def.options
      : schema._def.options;
  }
}
