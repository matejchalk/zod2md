import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';

export class DateModel implements IModel<z4.$ZodDate | z3.ZodDate> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodDate || schema instanceof z3.ZodDate;
  }

  renderBlock(): BlockText {
    return md.italic('Date.');
  }

  renderInline(): InlineText {
    return md.code('Date');
  }
}
