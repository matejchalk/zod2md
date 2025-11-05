import type { BlockText, InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

// dropped in Zod v4: https://zod.dev/v4/changelog?id=drops-zodbranded
export class BrandedModel
  implements IModel<z3.ZodBranded<z3.ZodTypeAny, PropertyKey>>
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z3.ZodBranded;
  }

  renderBlock(
    schema: z3.ZodBranded<z3.ZodTypeAny, PropertyKey>,
    renderer: Renderer
  ): BlockText {
    return renderer.renderSchemaBlock(schema._def.type);
  }

  renderInline(
    schema: z3.ZodBranded<z3.ZodTypeAny, PropertyKey>,
    renderer: Renderer
  ): InlineText {
    return renderer.renderSchemaInline(schema._def.type);
  }
}
