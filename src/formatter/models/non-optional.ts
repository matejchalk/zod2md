import { type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

export class NonOptionalModel implements IModel<z4.$ZodNonOptional> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodNonOptional;
  }

  renderBlock(schema: z4.$ZodNonOptional, renderer: Renderer): BlockText {
    return renderer.renderSchemaBlock(this.#getInnerType(schema));
  }

  renderInline(schema: z4.$ZodNonOptional, renderer: Renderer): InlineText {
    return renderer.renderSchemaInline(this.#getInnerType(schema));
  }

  #getInnerType(schema: z4.$ZodNonOptional): z4.$ZodType {
    return schema._zod.def.innerType instanceof z4.$ZodOptional
      ? schema._zod.def.innerType._zod.def.innerType
      : schema._zod.def.innerType;
  }
}
