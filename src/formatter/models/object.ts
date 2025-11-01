import {
  md,
  type BlockText,
  type InlineText,
  type TableColumn,
  type TableRow,
} from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import { formatLiteral } from '../formatting-utils';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

type ObjectField = {
  key: string;
  schema: z3.ZodTypeAny | z4.$ZodType;
  description: string;
  required: boolean;
  defaultValue?: unknown;
};

const REQUIRED_ASTERISK = '(\\*)';

export class ObjectModel
  implements IModel<z3.ZodObject<z3.ZodRawShape> | z4.$ZodObject>
{
  isSchema(schema: z3.ZodTypeAny | z4.$ZodType) {
    return schema instanceof z3.ZodObject || schema instanceof z4.$ZodObject;
  }

  renderBlock(
    schema: z3.ZodObject<z3.ZodRawShape> | z4.$ZodObject,
    renderer: Renderer
  ): BlockText {
    const fields = this.#parseObjectFields(schema, renderer);

    const hasDefault = fields.some(this.#hasDefaultValue);
    const hasDescription = fields.some(field => field.description);

    const tableColumns: TableColumn[] = [
      'Property',
      ...(hasDescription ? ['Description'] : []),
      'Type',
      ...(hasDefault ? ['Default'] : []),
    ];
    const tableRows: TableRow[] = fields.map(field => [
      field.required
        ? md.bold(md`${md.code(field.key)} ${REQUIRED_ASTERISK}`)
        : md.code(field.key),
      ...(hasDescription ? [field.description ?? ''] : []),
      renderer.renderSchemaInline(field.schema),
      ...(hasDefault
        ? [
            this.#hasDefaultValue(field)
              ? md.code(formatLiteral(field.defaultValue))
              : '',
          ]
        : []),
    ]);

    const introText = 'Object containing the following properties:';
    const footerText = fields.some(({ required }) => required)
      ? `${REQUIRED_ASTERISK} Required.`
      : 'All properties are optional.';

    return [
      md.paragraph(md.italic(introText)),
      md.paragraph(md.table(tableColumns, tableRows)),
      md.paragraph(md.italic(footerText)),
    ];
  }

  renderInline(
    schema: z3.ZodObject<z3.ZodRawShape> | z4.$ZodObject,
    renderer: Renderer
  ): InlineText {
    const fields = this.#parseObjectFields(schema, renderer);

    const listItems = fields.map(field => {
      const formattedKey = field.required
        ? md.bold(md`${md.code(field.key)} ${REQUIRED_ASTERISK}`)
        : md.code(field.key);
      const formattedType = renderer.renderSchemaInline(field.schema);
      const description = renderer.getDescription(field.schema);
      const formattedDescription = description ? ` - ${description}` : '';
      return `${formattedKey}: ${formattedType}${formattedDescription}`;
    });

    return md`${md.italic('Object with properties:')}${md.list(listItems)}`;
  }

  #parseObjectFields(
    schema: z3.ZodObject<z3.ZodRawShape> | z4.$ZodObject,
    renderer: Renderer
  ): ObjectField[] {
    if (schema instanceof z4.$ZodObject) {
      const isOptionalOrHasDefault = (s: z4.$ZodType) =>
        s instanceof z4.$ZodOptional || s instanceof z4.$ZodDefault;
      return Object.entries(schema._zod.def.shape).map(
        ([key, schema]): ObjectField => ({
          key,
          schema: isOptionalOrHasDefault(schema)
            ? schema._zod.def.innerType
            : schema,
          description: renderer.getDescription(schema) ?? '',
          required: !(
            isOptionalOrHasDefault(schema) ||
            renderer.findInWrapperTypeV4(
              schema,
              v =>
                v instanceof z4.$ZodUnion &&
                v._zod.def.options.some(isOptionalOrHasDefault)
            )
          ),
          ...(schema instanceof z4.$ZodDefault && {
            defaultValue: schema._zod.def.defaultValue,
          }),
        })
      );
    }

    return Object.entries(schema._def.shape()).map(
      ([key, schema]): ObjectField => ({
        key,
        schema:
          schema instanceof z3.ZodOptional || schema instanceof z3.ZodDefault
            ? schema._def.innerType
            : schema,
        description: renderer.getDescription(schema) ?? '',
        required: !schema.isOptional(),
        ...(schema instanceof z3.ZodDefault && {
          defaultValue: schema._def.defaultValue(),
        }),
      })
    );
  }

  #hasDefaultValue(field: ObjectField): field is Required<ObjectField> {
    const key = 'defaultValue' satisfies keyof ObjectField;
    return key in field;
  }
}
