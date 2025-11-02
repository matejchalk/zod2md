import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';

export class BooleanModel implements IModel<z4.$ZodBoolean | z3.ZodBoolean> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodBoolean || schema instanceof z3.ZodBoolean;
  }

  renderBlock(): BlockText {
    return md.italic('Boolean.');
  }

  renderInline(): InlineText {
    return md.code('boolean');
  }
}
