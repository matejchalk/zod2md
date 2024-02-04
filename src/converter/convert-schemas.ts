import {
  ZodAny,
  ZodArray,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodDefault,
  ZodEnum,
  ZodFunction,
  ZodIntersection,
  ZodLiteral,
  ZodNever,
  ZodNull,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRecord,
  ZodString,
  ZodSymbol,
  ZodType,
  ZodUndefined,
  ZodUnion,
  ZodUnknown,
  ZodVoid,
  z,
  type AnyZodObject,
  type ZodTuple,
  type ZodTypeAny,
} from 'zod';
import type {
  AnyModel,
  ArrayModel,
  BigIntModel,
  BooleanModel,
  DateModel,
  EnumModel,
  ExportedSchema,
  FunctionModel,
  IntersectionModel,
  LiteralModel,
  Model,
  ModelMeta,
  ModelOrRef,
  NamedModel,
  NeverModel,
  NullModel,
  NumberModel,
  ObjectModel,
  RecordModel,
  StringModel,
  SymbolModel,
  UndefinedModel,
  UnionModel,
  UnknownModel,
  VoidModel,
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
  const exportedSchema = exportedSchemas.find(exp =>
    isSameSchema(schema, exp.schema)
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

function isSameSchema(currSchema: ZodTypeAny, namedSchema: ZodTypeAny) {
  // unwrap ZodOptional, ZodNullable and ZodDefault
  const currSchemaUnwrapped: ZodTypeAny | null =
    currSchema instanceof ZodOptional ||
    currSchema instanceof ZodNullable ||
    currSchema instanceof ZodDefault
      ? currSchema._def.innerType
      : null;

  // unwrap .describe() - every property except for description must be identical
  const isOnlyDescriptionChanged = (schema: ZodTypeAny) =>
    Object.keys(namedSchema._def).every(
      key => namedSchema._def[key] === schema._def[key]
    ) &&
    schema.description !== namedSchema.description &&
    Object.keys(schema._def)
      .filter(key => key !== 'description')
      .map(key => namedSchema._def[key] === schema._def[key]);

  return (
    currSchema === namedSchema ||
    currSchemaUnwrapped === namedSchema ||
    isOnlyDescriptionChanged(currSchema) ||
    (currSchemaUnwrapped != null &&
      isOnlyDescriptionChanged(currSchemaUnwrapped))
  );
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
  if (schema instanceof ZodUnion) {
    return convertZodUnion(schema, exportedSchemas);
  }
  if (schema instanceof ZodIntersection) {
    return convertZodIntersection(schema, exportedSchemas);
  }
  if (schema instanceof ZodRecord) {
    return convertZodRecord(schema, exportedSchemas);
  }
  if (schema instanceof ZodFunction) {
    return convertZodFunction(schema, exportedSchemas);
  }
  if (schema instanceof ZodLiteral) {
    return convertZodLiteral(schema);
  }
  if (schema instanceof ZodNull) {
    return convertZodNull(schema);
  }
  if (schema instanceof ZodUndefined) {
    return convertZodUndefined(schema);
  }
  if (schema instanceof ZodSymbol) {
    return convertZodSymbol(schema);
  }
  if (schema instanceof ZodBigInt) {
    return convertZodBigInt(schema);
  }
  if (schema instanceof ZodUnknown) {
    return convertZodUnknown(schema);
  }
  if (schema instanceof ZodAny) {
    return convertZodAny(schema);
  }
  if (schema instanceof ZodVoid) {
    return convertZodVoid(schema);
  }
  if (schema instanceof ZodNever) {
    return convertZodNever(schema);
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

function convertZodIntersection(
  schema: ZodIntersection<ZodTypeAny, ZodTypeAny>,
  exportedSchemas: ExportedSchema[]
): IntersectionModel {
  return {
    type: 'intersection',
    parts: [
      createModelOrRef(schema._def.left, exportedSchemas),
      createModelOrRef(schema._def.right, exportedSchemas),
    ],
  };
}

function convertZodRecord(
  schema: ZodRecord,
  exportedSchemas: ExportedSchema[]
): RecordModel {
  return {
    type: 'record',
    keys: createModelOrRef(schema._def.keyType, exportedSchemas),
    values: createModelOrRef(schema._def.valueType, exportedSchemas),
  };
}

function convertZodFunction(
  schema: ZodFunction<ZodTuple<any>, ZodTypeAny>,
  exportedSchemas: ExportedSchema[]
): FunctionModel {
  return {
    type: 'function',
    // TODO: support rest args? what about implicit `...unknown[]`?
    parameters: (schema._def.args.items as ZodTypeAny[]).map(param =>
      createModelOrRef(param, exportedSchemas)
    ),
    returnValue: createModelOrRef(schema._def.returns, exportedSchemas),
  };
}

function convertZodLiteral(schema: ZodLiteral<z.Primitive>): LiteralModel {
  return {
    type: 'literal',
    value: schema._def.value,
  };
}

function convertZodNull(schema: ZodNull): NullModel {
  return {
    type: 'null',
  };
}

function convertZodUndefined(schema: ZodUndefined): UndefinedModel {
  return {
    type: 'undefined',
  };
}

function convertZodSymbol(schema: ZodSymbol): SymbolModel {
  return {
    type: 'symbol',
  };
}

function convertZodBigInt(schema: ZodBigInt): BigIntModel {
  return {
    type: 'bigint',
  };
}

function convertZodUnknown(schema: ZodUnknown): UnknownModel {
  return {
    type: 'unknown',
  };
}

function convertZodAny(schema: ZodAny): AnyModel {
  return {
    type: 'any',
  };
}

function convertZodVoid(schema: ZodVoid): VoidModel {
  return {
    type: 'void',
  };
}

function convertZodNever(schema: ZodNever): NeverModel {
  return {
    type: 'never',
  };
}
