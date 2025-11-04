import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

export class NullableModel
  implements IModel<z4.$ZodNullable | z3.ZodNullable<z3.ZodTypeAny>>
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return (
      schema instanceof z4.$ZodNullable || schema instanceof z3.ZodNullable
    );
  }

  renderBlock(
    schema: z4.$ZodNullable | z3.ZodNullable<z3.ZodTypeAny>,
    renderer: Renderer
  ): BlockText {
    const text = renderer.renderSchemaBlock(this.#getInnerType(schema));
    return md`${text}${md.paragraph(md.italic('Nullable.'))}`;
  }

  renderInline(
    schema: z4.$ZodNullable | z3.ZodNullable<z3.ZodTypeAny>,
    renderer: Renderer
  ): InlineText {
    const text = renderer.renderSchemaInline(this.#getInnerType(schema));
    return md`${text} (${md.italic('nullable')})`;
  }

  #getInnerType(
    schema: z4.$ZodNullable | z3.ZodNullable<z3.ZodTypeAny>
  ): z4.$ZodType | z3.ZodTypeAny {
    if (schema instanceof z4.$ZodNullable) {
      return schema._zod.def.innerType;
    }
    return schema._def.innerType;
  }
}
