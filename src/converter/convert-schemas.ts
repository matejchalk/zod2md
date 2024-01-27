import {
  ZodArray,
  ZodBoolean,
  ZodDate,
  ZodDefault,
  ZodEnum,
  ZodLiteral,
  ZodNumber,
  ZodObject,
  ZodOptional,
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

function convertSchema(
  schema: ZodType<unknown>,
  exportedSchemas: ExportedSchema[]
): Model {
  if (schema instanceof ZodOptional) {
    return convertSchema(schema._def.innerType, exportedSchemas);
  }
  if (schema instanceof ZodDefault) {
    return convertSchema(schema._def.innerType, exportedSchemas);
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

  throw new Error(
    `Zod type ${
      'typeName' in schema._def ? schema._def.typeName : '<unknown>'
    } is not supported`
  );
}

function createModelOrRef(
  schema: ZodType<unknown>,
  exportedSchemas: ExportedSchema[]
): ModelOrRef {
  const exportedSchema = exportedSchemas.find(s => s.schema === schema);
  if (exportedSchema) {
    const { schema, ...ref } = exportedSchema;
    return {
      kind: 'ref',
      ref,
    };
  }
  return {
    kind: 'model',
    model: convertSchema(schema, exportedSchemas),
  };
}

function convertZodArray(
  schema: ZodArray<ZodTypeAny>,
  exportedSchemas: ExportedSchema[]
): ArrayModel {
  return {
    type: 'array',
    items: createModelOrRef(schema._def.type, exportedSchemas),
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
        ...createModelOrRef(value, exportedSchemas),
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
