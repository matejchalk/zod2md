import { type BlockText, type InlineText, md } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';
import { formatLiteral } from '../utils';

export class PrefaultModel implements IModel<z4.$ZodPrefault> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodPrefault;
  }

  renderBlock(schema: z4.$ZodPrefault, renderer: Renderer): BlockText {
    const text = renderer.renderSchemaBlock(this.#getInnerType(schema));
    const prefaultValue = this.#getPrefaultValue(schema);
    return md`${text}${md.paragraph(
      md`${md.italic('Pre-parse default value is')} ${md.code(
        formatLiteral(prefaultValue),
      )}.`,
    )}`;
  }

  renderInline(schema: z4.$ZodPrefault, renderer: Renderer): InlineText {
    const text = renderer.renderSchemaInline(this.#getInnerType(schema));
    const prefaultValue = this.#getPrefaultValue(schema);
    return md`${text} (${md.italic('prefault:')} ${md.code(
      formatLiteral(prefaultValue),
    )})`;
  }

  #getInnerType(schema: z4.$ZodPrefault): z4.$ZodType | z3.ZodTypeAny {
    return schema._zod.def.innerType;
  }

  #getPrefaultValue(schema: z4.$ZodPrefault): unknown {
    return schema._zod.def.defaultValue;
  }
}
