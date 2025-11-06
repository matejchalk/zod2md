import { CodeMark, md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

export class TupleModel
  implements
    IModel<z4.$ZodTuple | z3.ZodTuple<z3.ZodTupleItems, z3.ZodTypeAny>>
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodTuple || schema instanceof z3.ZodTuple;
  }

  renderBlock(
    schema: z4.$ZodTuple | z3.ZodTuple<z3.ZodTupleItems, z3.ZodTypeAny>,
    renderer: Renderer
  ): BlockText {
    const { items, rest } = this.#listItems(schema);
    return md`${md.italic(
      `Tuple, array of ${items.length}${rest ? '+' : ''} items:`
    )}${md.list(
      'ordered',
      items.map(item => renderer.renderSchemaInline(item))
    )}${
      rest
        ? md.paragraph(
            md`${md.italic(
              '... followed by a variable number of'
            )} ${renderer.renderSchemaInline(rest)} ${md.italic('items')}.`
          )
        : ''
    }`;
  }

  renderInline(
    schema: z4.$ZodTuple | z3.ZodTuple<z3.ZodTupleItems, z3.ZodTypeAny>,
    renderer: Renderer
  ): InlineText {
    const { items, rest } = this.#listItems(schema);
    const formattedItems = items.map(item => renderer.renderSchemaInline(item));
    const formattedRest = rest && renderer.renderSchemaInline(rest);

    if (
      formattedItems.every(item => item instanceof CodeMark) &&
      (formattedRest == null || formattedRest instanceof CodeMark)
    ) {
      const formattedParts = [
        ...formattedItems.map(item => item.text),
        ...(formattedRest ? [`...${formattedRest.text}[]`] : []),
      ];
      return md.code(`[${formattedParts.join(', ')}]`);
    }

    return md`${md.italic('Tuple:')}${md.list('ordered', formattedItems)}${
      formattedRest
        ? md`${md.italic(
            '+ a variable number of'
          )} ${formattedRest} ${md.italic('items')}`
        : ''
    }`;
  }

  #listItems(
    schema: z4.$ZodTuple | z3.ZodTuple<z3.ZodTupleItems, z3.ZodTypeAny>
  ): {
    items: readonly (z4.$ZodType | z3.ZodTypeAny)[];
    rest: z4.$ZodType | z3.ZodTypeAny | null;
  } {
    return schema instanceof z4.$ZodTuple ? schema._zod.def : schema._def;
  }
}
