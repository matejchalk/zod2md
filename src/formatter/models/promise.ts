import { CodeMark, md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

// deprecated in Zod v4: https://zod.dev/v4/changelog?id=zpromise-deprecated
export class PromiseModel
  implements IModel<z4.$ZodPromise | z3.ZodPromise<z3.ZodTypeAny>>
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodPromise || schema instanceof z3.ZodPromise;
  }

  renderBlock(
    schema: z4.$ZodPromise | z3.ZodPromise<z3.ZodTypeAny>,
    renderer: Renderer
  ): BlockText {
    const formattedType = renderer.renderSchemaInline(
      this.#getInnerType(schema)
    );
    return md`${md.italic(
      'Promise, resolves to value of type:'
    )} ${formattedType}`;
  }

  renderInline(
    schema: z4.$ZodPromise | z3.ZodPromise<z3.ZodTypeAny>,
    renderer: Renderer
  ): InlineText {
    const formattedType = renderer.renderSchemaInline(
      this.#getInnerType(schema)
    );
    if (formattedType instanceof CodeMark) {
      return md.code(`Promise<${formattedType.text}>`);
    }
    return md`${md.italic('Promise of:')} ${formattedType}`;
  }

  #getInnerType(
    schema: z4.$ZodPromise | z3.ZodPromise<z3.ZodTypeAny>
  ): z4.$ZodType | z3.ZodTypeAny {
    if (schema instanceof z4.$ZodPromise) {
      return schema._zod.def.innerType;
    }
    return schema._def.type;
  }
}
