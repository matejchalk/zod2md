import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';

export class NeverModel implements IModel<z4.$ZodNever | z3.ZodNever> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodNever || schema instanceof z3.ZodNever;
  }

  renderBlock(): BlockText {
    return md.italic('Never type.');
  }

  renderInline(): InlineText {
    return md.code('never');
  }
}
