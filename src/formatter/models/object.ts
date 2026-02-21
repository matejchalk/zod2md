import {
  type BlockText,
  type InlineText,
  type TableColumn,
  type TableRow,
  md,
} from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';
import { formatLiteral } from '../utils';

type ObjectField = {
  key: string;
  schema: z4.$ZodType | z3.ZodTypeAny;
  description: string;
  required: boolean;
  defaultValue?: unknown;
};

type CustomRenderOptions = {
  objectName?: string;
};

const REQUIRED_ASTERISK = String.raw`(\*)`;

export class ObjectModel implements IModel<
  z4.$ZodObject | z3.ZodObject<z3.ZodRawShape>
> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return schema instanceof z4.$ZodObject || schema instanceof z3.ZodObject;
  }

  renderBlock(
    schema: z4.$ZodObject | z3.ZodObject<z3.ZodRawShape>,
    renderer: Renderer,
    options?: CustomRenderOptions,
  ): BlockText {
    const fields = this.#parseObjectFields(schema, renderer);

    const hasDefault = fields.some(this.#hasDefaultValue);
    const hasDescription = fields.some(field => field.description);

    const tableColumns: TableColumn[] = [
      'Property',
      ...(hasDescription ? ['Description'] : []),
      'Type',
      ...(hasDefault ? ['Default'] : []),
    ].map(heading => ({ heading, alignment: 'left' }));
    const tableRows: TableRow[] = fields.map(field => [
      field.required
        ? md`${md.bold(md.code(field.key))} ${REQUIRED_ASTERISK}`
        : md.code(field.key),
      ...(hasDescription ? [field.description ?? ''] : []),
      renderer.renderSchemaInline(
        this.#unwrapPropSchema(field.schema, renderer),
      ),
      ...(hasDefault
        ? [
            this.#hasDefaultValue(field)
              ? md.code(formatLiteral(field.defaultValue))
              : '',
          ]
        : []),
    ]);

    const introText = `${
      options?.objectName ?? 'Object'
    } containing the following properties:`;
    const footerText = fields.some(({ required }) => required)
      ? `${REQUIRED_ASTERISK} Required.`
      : 'All properties are optional.';

    return md`${md.paragraph(md.italic(introText))}${md.table(
      tableColumns,
      tableRows,
    )}${md.paragraph(md.italic(footerText))}`;
  }

  renderInline(
    schema: z4.$ZodObject | z3.ZodObject<z3.ZodRawShape>,
    renderer: Renderer,
    options?: CustomRenderOptions,
  ): InlineText {
    const fields = this.#parseObjectFields(schema, renderer);

    const listItems = fields.map(field => {
      const formattedKey = field.required
        ? md`${md.bold(md.code(field.key))} ${REQUIRED_ASTERISK}`
        : md.code(field.key);
      const formattedType = renderer.renderSchemaInline(
        this.#unwrapPropSchema(field.schema, renderer),
      );
      const description = renderer.getDescription(field.schema);
      const formattedDescription = description ? ` - ${description}` : '';
      return md`${formattedKey}: ${formattedType}${formattedDescription}`;
    });

    return md`${md.italic(
      options?.objectName ?? 'Object with properties:',
    )}${md.list(listItems)}`;
  }

  #parseObjectFields(
    schema: z4.$ZodObject | z3.ZodObject<z3.ZodRawShape>,
    renderer: Renderer,
  ): ObjectField[] {
    if (schema instanceof z4.$ZodObject) {
      return Object.entries(schema._zod.def.shape).map(
        ([key, propSchema]): ObjectField => {
          const defaultSchema = renderer.findInWrapperTypeV4(
            propSchema,
            v => v instanceof z4.$ZodDefault,
          );
          return {
            key,
            schema: propSchema,
            description: renderer.getDescription(propSchema) ?? '',
            required: !(
              this.#isOptionalOrHasDefaultV4(propSchema) ||
              renderer.findInWrapperTypeV4(
                propSchema,
                v =>
                  v instanceof z4.$ZodUnion &&
                  v._zod.def.options.some(this.#isOptionalOrHasDefaultV4),
              )
            ),
            ...(defaultSchema && {
              defaultValue: defaultSchema._zod.def.defaultValue,
            }),
          };
        },
      );
    }

    return Object.entries(schema._def.shape()).map(
      ([key, propSchema]): ObjectField => {
        const defaultSchema = renderer.findInWrapperTypeV3(
          propSchema,
          s => s instanceof z3.ZodDefault,
        );
        return {
          key,
          schema: propSchema,
          description: renderer.getDescription(propSchema) ?? '',
          required: !propSchema.isOptional(),
          ...(defaultSchema && {
            defaultValue: defaultSchema._def.defaultValue(),
          }),
        };
      },
    );
  }

  #hasDefaultValue(field: ObjectField): field is Required<ObjectField> {
    const key = 'defaultValue' satisfies keyof ObjectField;
    return key in field;
  }

  #unwrapPropSchema(
    schema: z4.$ZodType | z3.ZodTypeAny,
    renderer: Renderer,
  ): z4.$ZodType | z3.ZodTypeAny {
    if (renderer.findExportedSchema(schema)) {
      return schema;
    }
    if (schema instanceof z4.$ZodOptional || schema instanceof z4.$ZodDefault) {
      return this.#unwrapPropSchema(schema._zod.def.innerType, renderer);
    }
    if (schema instanceof z3.ZodOptional || schema instanceof z3.ZodDefault) {
      return this.#unwrapPropSchema(schema._def.innerType, renderer);
    }
    return schema;
  }

  #isOptionalOrHasDefaultV4(schema: z4.$ZodType) {
    return (
      schema instanceof z4.$ZodOptional || schema instanceof z4.$ZodDefault
    );
  }
}
