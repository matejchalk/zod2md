import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';
import { formatLiteral } from '../utils';

export class DefaultModel
  implements IModel<z4.$ZodDefault | z3.ZodDefault<z3.ZodTypeAny>>
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodDefault || schema instanceof z3.ZodDefault;
  }

  renderBlock(
    schema: z4.$ZodDefault | z3.ZodDefault<z3.ZodTypeAny>,
    renderer: Renderer
  ): BlockText {
    const text = renderer.renderSchemaBlock(this.#getInnerType(schema));
    const defaultValue = this.#getDefaultValue(schema);
    return md`${text}${md.paragraph(
      md`${md.italic('Default value is')} ${md.code(
        formatLiteral(defaultValue)
      )}.`
    )}`;
  }

  renderInline(
    schema: z4.$ZodDefault | z3.ZodDefault<z3.ZodTypeAny>,
    renderer: Renderer
  ): InlineText {
    const text = renderer.renderSchemaInline(this.#getInnerType(schema));
    const defaultValue = this.#getDefaultValue(schema);
    return md`${text} (${md.italic('default:')} ${md.code(
      formatLiteral(defaultValue)
    )})`;
  }

  #getInnerType(
    schema: z4.$ZodDefault | z3.ZodDefault<z3.ZodTypeAny>
  ): z4.$ZodType | z3.ZodTypeAny {
    if (schema instanceof z4.$ZodDefault) {
      return schema._zod.def.innerType;
    }
    return schema._def.innerType;
  }

  #getDefaultValue(
    schema: z4.$ZodDefault | z3.ZodDefault<z3.ZodTypeAny>
  ): unknown {
    if (schema instanceof z4.$ZodDefault) {
      return schema._zod.def.defaultValue;
    }
    return schema._def.defaultValue();
  }
}
