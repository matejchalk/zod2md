import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';

export class UndefinedModel
  implements IModel<z4.$ZodUndefined | z3.ZodUndefined>
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return (
      schema instanceof z4.$ZodUndefined || schema instanceof z3.ZodUndefined
    );
  }

  renderBlock(): BlockText {
    return md.italic('Undefined.');
  }

  renderInline(): InlineText {
    return md.code('undefined');
  }
}
