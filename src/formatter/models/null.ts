import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';

export class NullModel implements IModel<z4.$ZodNull | z3.ZodNull> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodNull || schema instanceof z3.ZodNull;
  }

  renderBlock(): BlockText {
    return md.italic('Null.');
  }

  renderInline(): InlineText {
    return md.code('null');
  }
}
