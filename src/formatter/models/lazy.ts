import type { BlockText, InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

export class LazyModel
  implements IModel<z4.$ZodLazy | z3.ZodLazy<z3.ZodTypeAny>>
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodLazy || schema instanceof z3.ZodLazy;
  }

  renderBlock(
    schema: z4.$ZodLazy | z3.ZodLazy<z3.ZodTypeAny>,
    renderer: Renderer
  ): BlockText {
    return renderer.renderSchemaBlock(this.#resolveType(schema));
  }

  renderInline(
    schema: z4.$ZodLazy | z3.ZodLazy<z3.ZodTypeAny>,
    renderer: Renderer
  ): InlineText {
    return renderer.renderSchemaInline(this.#resolveType(schema));
  }

  #resolveType(schema: z4.$ZodLazy | z3.ZodLazy<z3.ZodTypeAny>) {
    if (schema instanceof z4.$ZodLazy) {
      return schema._zod.def.getter();
    }
    return schema._def.getter();
  }
}
