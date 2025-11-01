import { md, type BlockText, type LinkMark } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import { normalizeExportedSchemas } from '../normalize';
import type { ExportedSchema, ExportedSchemas } from '../types';
import { defaultNameTransform } from './name-transform';
import type { IModel, NameTransformFn } from './types';
import { slugify } from './utils';

export class Renderer {
  #models: IModel<z3.ZodTypeAny | z4.$ZodType>[];
  #exportedSchemas: ExportedSchema[];
  #transformName: NameTransformFn;

  constructor(
    models: IModel<z3.ZodTypeAny | z4.$ZodType>[],
    exportedSchemas: ExportedSchemas,
    transformName: NameTransformFn = defaultNameTransform
  ) {
    this.#models = models;
    this.#exportedSchemas = normalizeExportedSchemas(exportedSchemas);
    this.#transformName = transformName;
  }

  renderSchemaBlock(schema: z3.ZodTypeAny | z4.$ZodType): BlockText {
    const model = this.findModel(schema);
    return model.renderBlock(schema, this);
  }

  renderSchemaInline(schema: z3.ZodTypeAny | z4.$ZodType): BlockText {
    const ref = this.findExportedSchema(schema);
    if (ref) {
      return this.formatExportedSchema(ref);
    }
    const model = this.findModel(schema);
    return model.renderInline(schema, this);
  }

  getDescription(
    schema: z3.ZodType<unknown> | z4.$ZodType
  ): string | undefined {
    if (schema instanceof z4.$ZodType) {
      const describedSchema = this.findInWrapperTypeV4(
        schema,
        s => !!z4.globalRegistry.get(s)?.description
      );
      return (
        describedSchema && z4.globalRegistry.get(describedSchema)?.description
      );
    }

    return schema.description;
  }

  findInWrapperTypeV4(
    schema: z4.$ZodType,
    predicate: (s: z4.$ZodType) => boolean
  ): z4.$ZodType | undefined {
    let curr = schema;
    while (!predicate(curr)) {
      if (
        curr instanceof z4.$ZodOptional ||
        curr instanceof z4.$ZodNullable ||
        curr instanceof z4.$ZodDefault ||
        curr instanceof z4.$ZodReadonly ||
        curr instanceof z4.$ZodCatch
      ) {
        curr = curr._zod.def.innerType;
      } else {
        return undefined;
      }
    }
    return curr;
  }

  formatExportedSchema(ref: ExportedSchema): LinkMark {
    const name = this.#transformName(ref.name, ref.path);
    const href = `#${slugify(name)}`;
    return md.link(href, name);
  }

  findExportedSchema(
    schema: z3.ZodTypeAny | z4.$ZodType
  ): ExportedSchema | undefined {
    return this.#exportedSchemas.find(ref =>
      this.#isSameSchema(schema, ref.schema)
    );
  }

  findModel(
    schema: z3.ZodTypeAny | z4.$ZodType
  ): IModel<z3.ZodTypeAny | z4.$ZodType> {
    const model = this.#models.find(model => model.isSchema(schema));
    if (model) {
      return model;
    }

    const typeName =
      schema instanceof z4.$ZodType
        ? schema.constructor.name
        : 'typeName' in schema._def
        ? schema._def.typeName
        : null;
    const message = [
      `WARNING: Zod type ${
        typeName ?? '<unknown>'
      } is not supported by zod2md, cannot render documentation.`,
      typeName &&
        `If you'd like support for ${typeName} to be added, please create an issue: https://github.com/matejchalk/zod2md/issues/new`,
    ]
      .filter(Boolean)
      .join('\n');

    console.warn(message);

    return {
      isSchema: (s): s is z3.ZodTypeAny | z4.$ZodType => true,
      renderBlock: () => md.quote(message),
      renderInline: () =>
        md.strikethrough(
          `WARNING: Zod type ${typeName ?? '<unknown>'} not supported`
        ),
    };
  }

  #isSameSchema(
    currSchema: z3.ZodTypeAny | z4.$ZodType,
    namedSchema: z3.ZodTypeAny | z4.$ZodType
  ) {
    const currSchemaDef =
      currSchema instanceof z4.$ZodType ? currSchema._zod.def : currSchema._def;

    // unwrap ZodOptional, ZodNullable, ZodDefault, etc. (exception for ZodPromise in v4)
    const currSchemaUnwrapped =
      'innerType' in currSchemaDef && !(currSchema instanceof z4.$ZodPromise)
        ? (currSchemaDef.innerType as z3.ZodTypeAny | z4.$ZodType)
        : null;

    // unwrap .describe() or .meta()
    const isOnlyDescriptionChanged = (schema: z3.ZodTypeAny | z4.$ZodType) => {
      if (schema instanceof z4.$ZodType && namedSchema instanceof z4.$ZodType) {
        return schema._zod.def === namedSchema._zod.def;
      }
      if (schema instanceof z3.ZodType && namedSchema instanceof z3.ZodType) {
        // every property except for description must be identical
        return (
          Object.keys(namedSchema._def).every(
            key => namedSchema._def[key] === schema._def[key]
          ) &&
          schema.description !== namedSchema.description &&
          Object.keys(schema._def)
            .filter(key => key !== 'description')
            .map(key => namedSchema._def[key] === schema._def[key])
        );
      }
      return false; // should be unreachable
    };

    return (
      currSchema === namedSchema ||
      currSchemaUnwrapped === namedSchema ||
      isOnlyDescriptionChanged(currSchema) ||
      (currSchemaUnwrapped != null &&
        isOnlyDescriptionChanged(currSchemaUnwrapped))
    );
  }
}
