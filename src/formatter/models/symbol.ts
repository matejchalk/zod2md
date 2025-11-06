import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';

export class SymbolModel implements IModel<z4.$ZodSymbol | z3.ZodSymbol> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodSymbol || schema instanceof z3.ZodSymbol;
  }

  renderBlock(): BlockText {
    return md.italic('Symbol.');
  }

  renderInline(): InlineText {
    return md.code('symbol');
  }
}
