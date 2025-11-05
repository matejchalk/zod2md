import type { BlockText, InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

export class CatchModel
  implements IModel<z4.$ZodCatch | z3.ZodCatch<z3.ZodTypeAny>>
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodCatch || schema instanceof z3.ZodCatch;
  }

  renderBlock(
    schema: z4.$ZodCatch | z3.ZodCatch<z3.ZodTypeAny>,
    renderer: Renderer
  ): BlockText {
    return renderer.renderSchemaBlock(this.#getInnerType(schema));
  }

  renderInline(
    schema: z4.$ZodCatch | z3.ZodCatch<z3.ZodTypeAny>,
    renderer: Renderer
  ): InlineText {
    return renderer.renderSchemaInline(this.#getInnerType(schema));
  }

  #getInnerType(schema: z4.$ZodCatch | z3.ZodCatch<z3.ZodTypeAny>) {
    if (schema instanceof z4.$ZodCatch) {
      return schema._zod.def.innerType;
    }
    return schema._def.innerType;
  }
}
