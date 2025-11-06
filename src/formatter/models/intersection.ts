import { CodeMark, md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

export class IntersectionModel
  implements
    IModel<
      z4.$ZodIntersection | z3.ZodIntersection<z3.ZodTypeAny, z3.ZodTypeAny>
    >
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return (
      schema instanceof z4.$ZodIntersection ||
      schema instanceof z3.ZodIntersection
    );
  }

  renderBlock(
    schema:
      | z4.$ZodIntersection
      | z3.ZodIntersection<z3.ZodTypeAny, z3.ZodTypeAny>,
    renderer: Renderer
  ): BlockText {
    const parts = this.#getParts(schema);
    return md`${md.italic('Intersection of the following types:')}${md.list([
      renderer.renderSchemaInline(parts.left),
      renderer.renderSchemaInline(parts.right),
    ])}`;
  }

  renderInline(
    schema:
      | z4.$ZodIntersection
      | z3.ZodIntersection<z3.ZodTypeAny, z3.ZodTypeAny>,
    renderer: Renderer
  ): InlineText {
    const parts = this.#getParts(schema);
    const { left, right } = {
      left: renderer.renderSchemaInline(parts.left),
      right: renderer.renderSchemaInline(parts.right),
    };
    if (left instanceof CodeMark && right instanceof CodeMark) {
      return md.code(`${left.text} & ${right.text}`);
    }
    return md`${left} ${md.italic('and')} ${right}`;
  }

  #getParts(
    schema:
      | z4.$ZodIntersection
      | z3.ZodIntersection<z3.ZodTypeAny, z3.ZodTypeAny>
  ): { left: z4.$ZodType | z3.ZodTypeAny; right: z4.$ZodType | z3.ZodTypeAny } {
    return schema instanceof z4.$ZodIntersection
      ? schema._zod.def
      : schema._def;
  }
}
