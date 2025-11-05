import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';

export class AnyModel implements IModel<z4.$ZodAny | z3.ZodAny> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodAny || schema instanceof z3.ZodAny;
  }

  renderBlock(): BlockText {
    return md.italic('Any type.');
  }

  renderInline(): InlineText {
    return md.code('any');
  }
}
