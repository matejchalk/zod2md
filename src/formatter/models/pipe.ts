import type { BlockText, InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

export class PipeModel
  implements IModel<z4.$ZodPipe | z3.ZodPipeline<z3.ZodTypeAny, z3.ZodTypeAny>>
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodPipe || schema instanceof z3.ZodPipeline;
  }

  renderBlock(
    schema: z4.$ZodPipe | z3.ZodPipeline<z3.ZodTypeAny, z3.ZodTypeAny>,
    renderer: Renderer
  ): BlockText {
    return renderer.renderSchemaBlock(this.#getWrappedType(schema));
  }

  renderInline(
    schema: z4.$ZodPipe | z3.ZodPipeline<z3.ZodTypeAny, z3.ZodTypeAny>,
    renderer: Renderer
  ): InlineText {
    return renderer.renderSchemaInline(this.#getWrappedType(schema));
  }

  #getWrappedType(
    schema: z4.$ZodPipe | z3.ZodPipeline<z3.ZodTypeAny, z3.ZodTypeAny>
  ) {
    if (schema instanceof z4.$ZodPipe) {
      return schema._zod.def.out instanceof z4.$ZodTransform
        ? schema._zod.def.in
        : schema._zod.def.out;
    }
    return schema._def.out instanceof z3.ZodTransformer
      ? schema._def.in
      : schema._def.out;
  }
}
