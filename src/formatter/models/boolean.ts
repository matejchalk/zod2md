import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';

export class BooleanModel implements IModel<z3.ZodBoolean | z4.$ZodBoolean> {
  isSchema(schema: z3.ZodTypeAny | z4.$ZodType) {
    return schema instanceof z3.ZodBoolean || schema instanceof z4.$ZodBoolean;
  }

  renderBlock(): BlockText {
    return md.italic('Boolean.');
  }

  renderInline(): InlineText {
    return md.code('boolean');
  }
}
