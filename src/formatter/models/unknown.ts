import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';

export class UnknownModel implements IModel<z4.$ZodUnknown | z3.ZodUnknown> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodUnknown || schema instanceof z3.ZodUnknown;
  }

  renderBlock(): BlockText {
    return md.italic('Unknown type.');
  }

  renderInline(): InlineText {
    return md.code('unknown');
  }
}
