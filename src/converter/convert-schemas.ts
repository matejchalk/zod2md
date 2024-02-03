import {
  ZodArray,
  ZodBoolean,
  ZodDate,
  ZodDefault,
  ZodEnum,
  ZodLiteral,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodString,
  ZodType,
  ZodUnion,
  ZodUnknown,
  z,
  type AnyZodObject,
  type ZodTypeAny,
} from 'zod';
import type {
  ArrayModel,
  BooleanModel,
  DateModel,
  EnumModel,
  ExportedSchema,
  LiteralModel,
  Model,
  ModelMeta,
  ModelOrRef,
  NamedModel,
  NumberModel,
  ObjectModel,
  StringModel,
  UnionModel,
  UnknownModel,
} from '../types';

export function convertSchemas(
  exportedSchemas: ExportedSchema[]
): NamedModel[] {
  return exportedSchemas.map(({ name, path, schema }) => ({
    name,
    path,
    ...convertSchema(schema, exportedSchemas),
    ...schemaToMeta(schema),
  }));
}

function createModelOrRef(
  schema: ZodType<unknown>,
  exportedSchemas: ExportedSchema[],
  implicitOptional?: boolean
): ModelOrRef {
  const exportedSchema = exportedSchemas.find(
    exp =>
      exp.schema === schema ||
      // unwrap ZodOptional, ZodNullable and ZodDefault
      ('innerType' in schema._def && exp.schema === schema._def.innerType)
  );
  if (exportedSchema) {
    const { schema: _, ...ref } = exportedSchema;
    return {
      kind: 'ref',
      ref: {
        ...ref,
        ...schemaToMeta(schema, implicitOptional),
      },
    };
  }
  return {
    kind: 'model',
    model: {
      ...convertSchema(schema, exportedSchemas),
      ...schemaToMeta(schema, implicitOptional),
    },
  };
}

function schemaToMeta(
  schema: ZodType<unknown>,
  implicitOptional?: boolean
): Omit<ModelMeta, 'default'> {
  return {
    ...(schema.description && { description: schema.description }),
    ...(!implicitOptional && schema.isOptional() && { optional: true }),
    ...(schema.isNullable() && { nullable: true }),
  };
}

function convertSchema(
  schema: ZodType<unknown>,
  exportedSchemas: ExportedSchema[]
): Model {
  if (schema instanceof ZodOptional) {
    return convertSchema(schema._def.innerType, exportedSchemas);
  }
  if (schema instanceof ZodNullable) {
    return convertSchema(schema._def.innerType, exportedSchemas);
  }
  if (schema instanceof ZodDefault) {
    return {
      ...convertSchema(schema._def.innerType, exportedSchemas),
      default: schema._def.defaultValue(),
    };
  }

  if (schema instanceof ZodArray) {
    return convertZodArray(schema, exportedSchemas);
  }
  if (schema instanceof ZodObject) {
    return convertZodObject(schema, exportedSchemas);
  }
  if (schema instanceof ZodString) {
    return convertZodString(schema);
  }
  if (schema instanceof ZodNumber) {
    return convertZodNumber(schema);
  }
  if (schema instanceof ZodBoolean) {
    return convertZodBoolean(schema);
  }
  if (schema instanceof ZodDate) {
    return convertZodDate(schema);
  }
  if (schema instanceof ZodEnum) {
    return convertZodEnum(schema);
  }
  if (schema instanceof ZodLiteral) {
    return convertZodLiteral(schema);
  }
  if (schema instanceof ZodUnknown) {
    return convertZodUnknown(schema);
  }
  if (schema instanceof ZodUnion) {
    return convertZodUnion(schema, exportedSchemas);
  }

  throw new Error(
    `Zod type ${
      'typeName' in schema._def ? schema._def.typeName : '<unknown>'
    } is not supported`
  );
}

function convertZodArray(
  schema: ZodArray<ZodTypeAny>,
  exportedSchemas: ExportedSchema[]
): ArrayModel {
  return {
    type: 'array',
    items: createModelOrRef(schema.element, exportedSchemas),
  };
}

function convertZodObject(
  schema: AnyZodObject,
  exportedSchemas: ExportedSchema[]
): ObjectModel {
  return {
    type: 'object',
    fields: Object.entries(schema._def.shape())
      .filter((pair): pair is [string, ZodType] => pair[1] instanceof ZodType)
      .map(([key, value]) => ({
        key,
        required: !value.isOptional(),
        ...createModelOrRef(value, exportedSchemas, true),
      })),
  };
}

function convertZodString(schema: ZodString): StringModel {
  return {
    type: 'string',
  };
}

function convertZodNumber(schema: ZodNumber): NumberModel {
  return {
    type: 'number',
  };
}

function convertZodBoolean(schema: ZodBoolean): BooleanModel {
  return {
    type: 'boolean',
  };
}

function convertZodDate(schema: ZodDate): DateModel {
  return {
    type: 'date',
  };
}

function convertZodEnum(schema: ZodEnum<[string, ...string[]]>): EnumModel {
  return {
    type: 'enum',
    values: schema._def.values,
  };
}

function convertZodUnknown(schema: ZodUnknown): UnknownModel {
  return {
    type: 'unknown',
  };
}

function convertZodLiteral(schema: ZodLiteral<z.Primitive>): LiteralModel {
  return {
    type: 'literal',
    value: schema._def.value,
  };
}

function convertZodUnion(
  schema: ZodUnion<readonly [ZodTypeAny, ...ZodTypeAny[]]>,
  exportedSchemas: ExportedSchema[]
): UnionModel {
  return {
    type: 'union',
    options: schema._def.options.map(option =>
      createModelOrRef(option, exportedSchemas)
    ),
  };
}
