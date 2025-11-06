import { CodeMark, md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

export class RecordModel
  implements IModel<z4.$ZodRecord | z3.ZodRecord<z3.KeySchema, z3.ZodTypeAny>>
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodRecord || schema instanceof z3.ZodRecord;
  }

  renderBlock(
    schema: z4.$ZodRecord | z3.ZodRecord<z3.KeySchema, z3.ZodTypeAny>,
    renderer: Renderer
  ): BlockText {
    const { keyType, valueType } = this.#getKeysAndValues(schema);
    return md`${md.paragraph(md.italic('Object with dynamic keys:'))}${md.list([
      md`${md.italic('keys of type')} ${renderer.renderSchemaInline(keyType)}`,
      md`${md.italic('values of type')} ${renderer.renderSchemaInline(
        valueType
      )}`,
    ])}`;
  }

  renderInline(
    schema: z4.$ZodRecord | z3.ZodRecord<z3.KeySchema, z3.ZodTypeAny>,
    renderer: Renderer
  ): InlineText {
    const { keyType, valueType } = this.#getKeysAndValues(schema);
    const formattedKey = renderer.renderSchemaInline(keyType);
    const formattedValue = renderer.renderSchemaInline(valueType);
    if (
      formattedKey instanceof CodeMark &&
      formattedValue instanceof CodeMark
    ) {
      return md.code(`Record<${formattedKey.text}, ${formattedValue.text}>`);
    }
    return md`${md.italic(
      'Object with dynamic keys of type'
    )} ${formattedKey} ${md.italic('and values of type')} ${formattedValue}`;
  }

  #getKeysAndValues(
    schema: z4.$ZodRecord | z3.ZodRecord<z3.KeySchema, z3.ZodTypeAny>
  ): {
    keyType: z4.$ZodRecordKey | z3.KeySchema;
    valueType: z4.$ZodType | z3.ZodTypeAny;
  } {
    return schema instanceof z4.$ZodRecord ? schema._zod.def : schema._def;
  }
}
