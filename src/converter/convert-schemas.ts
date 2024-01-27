import {
  ZodArray,
  ZodBoolean,
  ZodDate,
  ZodEnum,
  ZodLiteral,
  ZodNumber,
  ZodObject,
  ZodString,
  ZodType,
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
  ModelOrRef,
  NamedModel,
  NumberModel,
  ObjectModel,
  StringModel,
  UnknownModel,
} from '../types';

export function convertSchemas(
  exportedSchemas: ExportedSchema[]
): NamedModel[] {
  return exportedSchemas.map(({ name, path, schema }) => ({
    name,
    path,
    ...convertSchema(schema, exportedSchemas),
  }));
}

export function convertSchema(
  schema: ZodType<unknown>,
  exportedSchemas: ExportedSchema[]
): Model {
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
  if (schema instanceof ZodEnum) {
    return convertZodEnum(schema);
  }
  if (schema instanceof ZodLiteral) {
    return convertZodLiteral(schema);
  }
  if (schema instanceof ZodUnknown) {
    return convertZodUnknown(schema);
  }

  throw new Error(
    `Zod type ${
      'typeName' in schema._def ? schema._def.typeName : '<unknown>'
    } is not supported`
  );
}

export function createModelOrRef(
  schema: ZodType<unknown>,
  exportedSchemas: ExportedSchema[]
): ModelOrRef {
  const exportedSchema = exportedSchemas.find(s => s.schema === schema);
  if (exportedSchema) {
    return {
      kind: 'ref',
      ...exportedSchema,
    };
  }
  return {
    kind: 'model',
    model: convertSchema(schema, exportedSchemas),
  };
}

export function convertZodArray(
  schema: ZodArray<ZodTypeAny>,
  exportedSchemas: ExportedSchema[]
): ArrayModel {
  return {
    type: 'array',
    items: createModelOrRef(schema._def.type, exportedSchemas),
  };
}

export function convertZodObject(
  schema: AnyZodObject,
  exportedSchemas: ExportedSchema[]
): ObjectModel {
  return {
    type: 'object',
    fields: Object.entries(schema._def.shape())
      .filter((pair): pair is [string, ZodType] => pair[1] instanceof ZodType)
      .map(([key, value]) => ({
        name: key,
        required: !value.isOptional(),
        ...createModelOrRef(value, exportedSchemas),
      })),
  };
}

export function convertZodString(schema: ZodString): StringModel {
  return {
    type: 'string',
  };
}

export function convertZodNumber(schema: ZodNumber): NumberModel {
  return {
    type: 'number',
  };
}

export function convertZodBoolean(schema: ZodBoolean): BooleanModel {
  return {
    type: 'boolean',
  };
}

export function convertZodDate(schema: ZodDate): DateModel {
  return {
    type: 'date',
  };
}

export function convertZodEnum(
  schema: ZodEnum<[string, ...string[]]>
): EnumModel {
  return {
    type: 'enum',
    values: schema._def.values,
  };
}

export function convertZodUnknown(schema: ZodUnknown): UnknownModel {
  return {
    type: 'unknown',
  };
}

export function convertZodLiteral(
  schema: ZodLiteral<z.Primitive>
): LiteralModel {
  return {
    type: 'literal',
    value: schema._def.value,
  };
}
