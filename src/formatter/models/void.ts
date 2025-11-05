import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';

export class VoidModel implements IModel<z4.$ZodVoid | z3.ZodVoid> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodVoid || schema instanceof z3.ZodVoid;
  }

  renderBlock(): BlockText {
    return md.italic('Void type.');
  }

  renderInline(): InlineText {
    return md.code('void');
  }
}
