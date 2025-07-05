import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4';
import type {
  AnyModel,
  ArrayModel,
  ArrayValidation,
  BigIntModel,
  BigIntValidation,
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
  NativeEnumModel,
  NeverModel,
  NullModel,
  NumberModel,
  NumberValidation,
  ObjectModel,
  PromiseModel,
  RecordModel,
  StringModel,
  StringValidation,
  SymbolModel,
  TupleModel,
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
  schema: z3.ZodType<unknown> | z4.core.$ZodType,
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

function isSameSchema(
  currSchema: z3.ZodTypeAny | z4.core.$ZodType,
  namedSchema: z3.ZodTypeAny | z4.core.$ZodType
) {
  const currSchemaDef =
    currSchema instanceof z4.core.$ZodType
      ? currSchema._zod.def
      : currSchema._def;

  // unwrap ZodOptional, ZodNullable, ZodDefault, etc.
  const currSchemaUnwrapped =
    'innerType' in currSchemaDef
      ? (currSchemaDef.innerType as z3.ZodTypeAny | z4.core.$ZodType)
      : null;

  // unwrap .describe() - every property except for description must be identical
  const isOnlyDescriptionChanged = (
    schema: z3.ZodTypeAny | z4.core.$ZodType
  ) => {
    if (
      schema instanceof z4.core.$ZodType ||
      namedSchema instanceof z4.core.$ZodType
    ) {
      // Zod v4 stores description in registry
      return false;
    }
    const schemaDef =
      schema instanceof z4.core.$ZodType ? schema._zod.def : schema._def;
    return (
      Object.keys(namedSchema._def).every(
        key => namedSchema._def[key] === schemaDef[key]
      ) &&
      schema.description !== namedSchema.description &&
      Object.keys(schemaDef)
        .filter(key => key !== 'description')
        .map(key => namedSchema._def[key] === schemaDef[key])
    );
  };

  return (
    currSchema === namedSchema ||
    currSchemaUnwrapped === namedSchema ||
    isOnlyDescriptionChanged(currSchema) ||
    (currSchemaUnwrapped != null &&
      isOnlyDescriptionChanged(currSchemaUnwrapped))
  );
}

function schemaToMeta(
  schema: z3.ZodType<unknown> | z4.core.$ZodType,
  implicitOptional?: boolean
): Omit<ModelMeta, 'default'> {
  if (schema instanceof z4.core.$ZodType) {
    const describedSchema = findInWrapperType(
      schema,
      s => !!z4.globalRegistry.get(s)?.description
    );
    const description =
      describedSchema && z4.globalRegistry.get(describedSchema)?.description;

    return {
      ...(description && { description }),
      ...(!implicitOptional &&
        findInWrapperType(schema, s => s instanceof z4.core.$ZodOptional) && {
          optional: true,
        }),
      ...(findInWrapperType(schema, s => s instanceof z4.core.$ZodNullable) && {
        nullable: true,
      }),
    };
  }

  const safeCheck = (is: () => boolean) => {
    try {
      return is();
    } catch {
      return false;
    }
  };
  return {
    ...(schema.description && { description: schema.description }),
    ...(!implicitOptional &&
      safeCheck(schema.isOptional) && { optional: true }),
    ...(safeCheck(schema.isNullable) && { nullable: true }),
  };
}

function findInWrapperType(
  schema: z4.core.$ZodType,
  predicate: (s: z4.core.$ZodType) => boolean
): z4.core.$ZodType | null {
  let curr = schema;
  while (!predicate(curr)) {
    if (
      curr instanceof z4.core.$ZodOptional ||
      curr instanceof z4.core.$ZodNullable ||
      curr instanceof z4.core.$ZodDefault ||
      curr instanceof z4.core.$ZodReadonly ||
      curr instanceof z4.core.$ZodCatch
    ) {
      curr = curr._zod.def.innerType;
    } else {
      return null;
    }
  }
  return curr;
}

function convertSchema(
  schema: z3.ZodType<unknown> | z4.core.$ZodType,
  exportedSchemas: ExportedSchema[]
): Model {
  if (schema instanceof z3.ZodOptional) {
    return convertSchema(schema._def.innerType, exportedSchemas);
  }
  if (schema instanceof z4.core.$ZodOptional) {
    return convertSchema(schema._zod.def.innerType, exportedSchemas);
  }

  if (schema instanceof z3.ZodNullable) {
    return convertSchema(schema._def.innerType, exportedSchemas);
  }
  if (schema instanceof z4.core.$ZodNullable) {
    return convertSchema(schema._zod.def.innerType, exportedSchemas);
  }

  if (schema instanceof z3.ZodDefault) {
    return {
      ...convertSchema(schema._def.innerType, exportedSchemas),
      default: schema._def.defaultValue(),
    };
  }
  if (schema instanceof z4.core.$ZodDefault) {
    return {
      ...convertSchema(schema._zod.def.innerType, exportedSchemas),
      default: schema._zod.def.defaultValue,
    };
  }

  if (schema instanceof z3.ZodReadonly) {
    return {
      ...convertSchema(schema._def.innerType, exportedSchemas),
      readonly: true,
    };
  }
  if (schema instanceof z4.core.$ZodReadonly) {
    return {
      ...convertSchema(schema._zod.def.innerType, exportedSchemas),
      readonly: true,
    };
  }

  // dropped in Zod v4: https://zod.dev/v4/changelog?id=drops-zodeffects
  if (schema instanceof z3.ZodEffects) {
    return convertSchema(schema._def.schema, exportedSchemas);
  }

  if (schema instanceof z3.ZodCatch) {
    return convertSchema(schema._def.innerType, exportedSchemas);
  }
  if (schema instanceof z4.core.$ZodCatch) {
    return convertSchema(schema._zod.def.innerType, exportedSchemas);
  }

  // dropped in Zod v4: https://zod.dev/v4/changelog?id=drops-zodbranded
  if (schema instanceof z3.ZodBranded) {
    return convertSchema(schema._def.type, exportedSchemas);
  }

  if (schema instanceof z3.ZodLazy) {
    return convertSchema(schema._def.getter(), exportedSchemas);
  }
  if (schema instanceof z4.core.$ZodLazy) {
    return convertSchema(schema._zod.def.getter(), exportedSchemas);
  }

  if (schema instanceof z3.ZodPipeline) {
    return convertSchema(schema._def.out, exportedSchemas);
  }
  if (schema instanceof z4.core.$ZodPipe) {
    return convertSchema(schema._zod.def.out, exportedSchemas);
  }

  if (schema instanceof z3.ZodDiscriminatedUnion) {
    return {
      type: 'union',
      options: schema._def.options.map((option: any) =>
        createModelOrRef(option, exportedSchemas)
      ),
    };
  }
  if (schema instanceof z4.core.$ZodDiscriminatedUnion) {
    return {
      type: 'union',
      options: schema._zod.def.options.map((option: any) =>
        createModelOrRef(option, exportedSchemas)
      ),
    };
  }

  if (schema instanceof z3.ZodArray || schema instanceof z4.core.$ZodArray) {
    return convertZodArray(schema, exportedSchemas);
  }
  if (schema instanceof z3.ZodObject || schema instanceof z4.core.$ZodObject) {
    return convertZodObject(schema, exportedSchemas);
  }
  if (schema instanceof z3.ZodString || isV4StringType(schema)) {
    return convertZodString(schema);
  }
  if (schema instanceof z3.ZodNumber || schema instanceof z4.core.$ZodNumber) {
    return convertZodNumber(schema);
  }
  if (
    schema instanceof z3.ZodBoolean ||
    schema instanceof z4.core.$ZodBoolean
  ) {
    return convertZodBoolean(schema);
  }
  if (schema instanceof z3.ZodDate || schema instanceof z4.core.$ZodDate) {
    return convertZodDate(schema);
  }
  if (schema instanceof z3.ZodEnum || schema instanceof z4.core.$ZodEnum) {
    return convertZodEnum(schema);
  }
  if (schema instanceof z3.ZodNativeEnum) {
    // dropped in Zod v4: https://zod.dev/v4/changelog?id=znativeenum-deprecated
    return convertZodNativeEnum(schema);
  }
  if (schema instanceof z3.ZodUnion || schema instanceof z4.core.$ZodUnion) {
    return convertZodUnion(schema, exportedSchemas);
  }
  if (
    schema instanceof z3.ZodIntersection ||
    schema instanceof z4.core.$ZodIntersection
  ) {
    return convertZodIntersection(schema, exportedSchemas);
  }
  if (schema instanceof z3.ZodRecord || schema instanceof z4.core.$ZodRecord) {
    return convertZodRecord(schema, exportedSchemas);
  }
  if (schema instanceof z3.ZodTuple || schema instanceof z4.core.$ZodTuple) {
    return convertZodTuple(schema, exportedSchemas);
  }
  if (
    schema instanceof z3.ZodFunction ||
    schema instanceof z4.core.$ZodFunction
  ) {
    return convertZodFunction(schema, exportedSchemas);
  }
  if (
    schema instanceof z3.ZodPromise ||
    schema instanceof z4.core.$ZodPromise
  ) {
    // deprecated in Zod v4: https://zod.dev/v4/changelog?id=zpromise-deprecated
    return convertZodPromise(schema, exportedSchemas);
  }
  if (
    schema instanceof z3.ZodLiteral ||
    schema instanceof z4.core.$ZodLiteral
  ) {
    return convertZodLiteralOrUnion(schema);
  }
  if (schema instanceof z3.ZodNull || schema instanceof z4.core.$ZodNull) {
    return convertZodNull(schema);
  }
  if (
    schema instanceof z3.ZodUndefined ||
    schema instanceof z4.core.$ZodUndefined
  ) {
    return convertZodUndefined(schema);
  }
  if (schema instanceof z3.ZodSymbol || schema instanceof z4.core.$ZodSymbol) {
    return convertZodSymbol(schema);
  }
  if (schema instanceof z3.ZodBigInt || schema instanceof z4.core.$ZodBigInt) {
    return convertZodBigInt(schema);
  }
  if (
    schema instanceof z3.ZodUnknown ||
    schema instanceof z4.core.$ZodUnknown
  ) {
    return convertZodUnknown(schema);
  }
  if (schema instanceof z3.ZodAny || schema instanceof z4.core.$ZodAny) {
    return convertZodAny(schema);
  }
  if (schema instanceof z3.ZodVoid || schema instanceof z4.core.$ZodVoid) {
    return convertZodVoid(schema);
  }
  if (schema instanceof z3.ZodNever || schema instanceof z4.core.$ZodNever) {
    return convertZodNever(schema);
  }

  const typeName =
    schema instanceof z4.core.$ZodType
      ? schema._zod.def.type
      : 'typeName' in schema._def
      ? schema._def.typeName
      : null;
  const message = [
    `WARNING: Zod type ${
      typeName ?? '<unknown>'
    } is not supported, using never.`,
    typeName &&
      `If you'd like support for ${typeName} to be added, please create an issue: https://github.com/matejchalk/zod2md/issues/new`,
  ]
    .filter(Boolean)
    .join('\n');
  console.warn(message);
  return {
    type: 'never',
  };
}

function convertZodArray(
  schema: z3.ZodArray<z3.ZodTypeAny> | z4.core.$ZodArray<z4.core.$ZodType>,
  exportedSchemas: ExportedSchema[]
): ArrayModel {
  const possibleValidations: (ArrayValidation | null)[] =
    schema instanceof z3.ZodArray
      ? [
          schema._def.minLength && ['min', schema._def.minLength.value],
          schema._def.maxLength && ['max', schema._def.maxLength.value],
          schema._def.exactLength && ['length', schema._def.exactLength.value],
        ]
      : schema._zod.def.checks?.map((check): ArrayValidation | null => {
          if (check instanceof z4.core.$ZodCheckMinLength) {
            return ['min', check._zod.def.minimum];
          }
          if (check instanceof z4.core.$ZodCheckMaxLength) {
            return ['max', check._zod.def.maximum];
          }
          if (check instanceof z4.core.$ZodCheckLengthEquals) {
            return ['length', check._zod.def.length];
          }
          return null;
        }) ?? [];
  const validations = possibleValidations.filter(value => value != null);

  const itemSchema =
    schema instanceof z3.ZodArray ? schema.element : schema._zod.def.element;

  return {
    type: 'array',
    items: createModelOrRef(itemSchema, exportedSchemas),
    ...(validations.length > 0 && { validations }),
  };
}

function convertZodObject(
  schema: z3.AnyZodObject | z4.core.$ZodObject,
  exportedSchemas: ExportedSchema[]
): ObjectModel {
  if (schema instanceof z4.core.$ZodObject) {
    return {
      type: 'object',
      fields: Object.entries(schema._zod.def.shape).map(([key, value]) => ({
        key,
        required: !(
          value instanceof z4.core.$ZodOptional ||
          value instanceof z4.core.$ZodDefault
        ),
        ...createModelOrRef(value, exportedSchemas, true),
      })),
    };
  }

  return {
    type: 'object',
    fields: Object.entries(schema._def.shape())
      .filter(
        (pair): pair is [string, z3.ZodType] => pair[1] instanceof z3.ZodType
      )
      .map(([key, value]) => ({
        key,
        required: !value.isOptional(),
        ...createModelOrRef(value, exportedSchemas, true),
      })),
  };
}

const V4_STRING_TYPES = [
  z4.core.$ZodString,
  z4.core.$ZodEmail,
  z4.core.$ZodURL,
  z4.core.$ZodEmoji,
  z4.core.$ZodUUID,
  z4.core.$ZodCUID,
  z4.core.$ZodCUID2,
  z4.core.$ZodULID,
  z4.core.$ZodNanoID,
  z4.core.$ZodBase64,
  z4.core.$ZodBase64URL,
  z4.core.$ZodJWT,
  z4.core.$ZodISODate,
  z4.core.$ZodISOTime,
  z4.core.$ZodISODateTime,
  z4.core.$ZodISODuration,
  z4.core.$ZodIPv4,
  z4.core.$ZodIPv6,
  z4.core.$ZodCIDRv4,
  z4.core.$ZodCIDRv6,
] as const;
type V4StringType = InstanceType<(typeof V4_STRING_TYPES)[number]>;

function isV4StringType(
  schema: z3.ZodTypeAny | z4.core.$ZodType
): schema is V4StringType {
  return V4_STRING_TYPES.some(type => schema instanceof type);
}

function parseV4StringType(
  obj: V4StringType | z4.core.$ZodCheck
): StringValidation | null {
  if (obj instanceof z4.core.$ZodEmail) {
    return 'email';
  }
  if (obj instanceof z4.core.$ZodURL) {
    return 'url';
  }
  if (obj instanceof z4.core.$ZodEmoji) {
    return 'emoji';
  }
  if (obj instanceof z4.core.$ZodUUID) {
    return 'uuid';
  }
  if (obj instanceof z4.core.$ZodCUID) {
    return 'cuid';
  }
  if (obj instanceof z4.core.$ZodCUID2) {
    return 'cuid2';
  }
  if (obj instanceof z4.core.$ZodULID) {
    return 'ulid';
  }
  if (obj instanceof z4.core.$ZodNanoID) {
    return 'nanoid';
  }
  if (obj instanceof z4.core.$ZodBase64) {
    return 'base64';
  }
  if (obj instanceof z4.core.$ZodBase64URL) {
    return 'base64url';
  }
  if (obj instanceof z4.core.$ZodJWT) {
    return 'jwt';
  }
  if (obj instanceof z4.core.$ZodISODate) {
    return 'date';
  }
  if (obj instanceof z4.core.$ZodISOTime) {
    return 'time';
  }
  if (obj instanceof z4.core.$ZodISODateTime) {
    return [
      'datetime',
      { offset: obj._zod.def.offset, precision: obj._zod.def.precision },
    ];
  }
  if (obj instanceof z4.core.$ZodISODuration) {
    return 'duration';
  }
  if (obj instanceof z4.core.$ZodIPv4) {
    return ['ip', { version: 'v4' }];
  }
  if (obj instanceof z4.core.$ZodIPv6) {
    return ['ip', { version: 'v6' }];
  }
  if (obj instanceof z4.core.$ZodCIDRv4) {
    return ['cidr', { version: 'v4' }];
  }
  if (obj instanceof z4.core.$ZodCIDRv6) {
    return ['cidr', { version: 'v6' }];
  }

  return null;
}

function convertZodString(schema: z3.ZodString | V4StringType): StringModel {
  if (schema instanceof z3.ZodString) {
    return {
      type: 'string',
      ...(schema._def.checks.length > 0 && {
        validations: schema._def.checks
          .map((check): StringValidation | null => {
            switch (check.kind) {
              case 'email':
              case 'url':
              case 'emoji':
              case 'uuid':
              case 'cuid':
              case 'cuid2':
              case 'ulid':
              case 'nanoid':
              case 'base64':
              case 'base64url':
              case 'jwt':
              case 'date':
              case 'time':
              case 'duration':
                return check.kind;
              case 'datetime':
                return [
                  check.kind,
                  { offset: check.offset, precision: check.precision },
                ];
              case 'ip':
              case 'cidr':
                return [check.kind, { version: check.version }];
              case 'min':
              case 'max':
              case 'length':
                return [check.kind, check.value];
              case 'regex':
                return [check.kind, check.regex];
              case 'includes':
              case 'startsWith':
              case 'endsWith':
                return [check.kind, check.value];
              case 'toLowerCase':
              case 'toUpperCase':
              case 'trim':
                return null;
            }
          })
          .filter((value): value is StringValidation => value != null),
      }),
    };
  }

  const subType = parseV4StringType(schema);

  const checks =
    schema._zod.def.checks?.map((check): StringValidation | null => {
      if (check instanceof z4.core.$ZodCheckMinLength) {
        return ['min', check._zod.def.minimum];
      }
      if (check instanceof z4.core.$ZodCheckMaxLength) {
        return ['max', check._zod.def.maximum];
      }
      if (check instanceof z4.core.$ZodCheckLengthEquals) {
        return ['length', check._zod.def.length];
      }
      if (check instanceof z4.core.$ZodCheckRegex) {
        return ['regex', check._zod.def.pattern];
      }
      if (check instanceof z4.core.$ZodCheckIncludes) {
        return ['includes', check._zod.def.includes];
      }
      if (check instanceof z4.core.$ZodCheckStartsWith) {
        return ['startsWith', check._zod.def.prefix];
      }
      if (check instanceof z4.core.$ZodCheckEndsWith) {
        return ['endsWith', check._zod.def.suffix];
      }
      return parseV4StringType(check);
    }) ?? [];

  const validations = [subType, ...checks].filter(value => value != null);

  return {
    type: 'string',
    ...(validations.length && { validations }),
  };
}

function convertZodNumber(
  schema: z3.ZodNumber | z4.core.$ZodNumber
): NumberModel {
  if (schema instanceof z3.ZodNumber) {
    return {
      type: 'number',
      ...(schema._def.checks.length > 0 && {
        validations: schema._def.checks.map((check): NumberValidation => {
          switch (check.kind) {
            case 'min':
              return [check.inclusive ? 'gte' : 'gt', check.value];
            case 'max':
              return [check.inclusive ? 'lte' : 'lt', check.value];
            case 'multipleOf':
              return [check.kind, check.value];
            case 'int':
            case 'finite':
              return check.kind;
          }
        }),
      }),
    };
  }

  return {
    type: 'number',
    ...(schema._zod.def.checks?.length && {
      validations: schema._zod.def.checks
        .map((check): NumberValidation | null => {
          if (check instanceof z4.core.$ZodCheckGreaterThan) {
            return [
              check._zod.def.inclusive ? 'gte' : 'gt',
              Number(check._zod.def.value),
            ];
          }
          if (check instanceof z4.core.$ZodCheckLessThan) {
            return [
              check._zod.def.inclusive ? 'lte' : 'lt',
              Number(check._zod.def.value),
            ];
          }
          if (check instanceof z4.core.$ZodCheckMultipleOf) {
            return ['multipleOf', Number(check._zod.def.value)];
          }
          if (check instanceof z4.core.$ZodNumberFormat) {
            return check._zod.def.format;
          }
          return null;
        })
        .filter(validation => validation != null),
    }),
  };
}

function convertZodBoolean(
  schema: z3.ZodBoolean | z4.core.$ZodBoolean
): BooleanModel {
  return {
    type: 'boolean',
  };
}

function convertZodDate(schema: z3.ZodDate | z4.core.$ZodDate): DateModel {
  return {
    type: 'date',
  };
}

function convertZodEnum(
  schema: z3.ZodEnum<[string, ...string[]]> | z4.core.$ZodEnum
): EnumModel {
  if (schema instanceof z4.core.$ZodEnum) {
    return {
      type: 'enum',
      values: Object.values(schema._zod.def.entries),
    };
  }

  return {
    type: 'enum',
    values: schema._def.values,
  };
}

function convertZodNativeEnum(
  schema: z3.ZodNativeEnum<z3.EnumLike>
): NativeEnumModel {
  return {
    type: 'native-enum',
    enum: schema.enum,
  };
}

function convertZodUnion(
  schema:
    | z3.ZodUnion<readonly [z3.ZodTypeAny, ...z3.ZodTypeAny[]]>
    | z4.core.$ZodUnion,
  exportedSchemas: ExportedSchema[]
): UnionModel {
  const options =
    schema instanceof z4.core.$ZodUnion
      ? schema._zod.def.options
      : schema._def.options;

  return {
    type: 'union',
    options: options.map(option => createModelOrRef(option, exportedSchemas)),
  };
}

function convertZodIntersection(
  schema:
    | z3.ZodIntersection<z3.ZodTypeAny, z3.ZodTypeAny>
    | z4.core.$ZodIntersection,
  exportedSchemas: ExportedSchema[]
): IntersectionModel {
  const schemaDef =
    schema instanceof z4.core.$ZodIntersection ? schema._zod.def : schema._def;

  return {
    type: 'intersection',
    parts: [
      createModelOrRef(schemaDef.left, exportedSchemas),
      createModelOrRef(schemaDef.right, exportedSchemas),
    ],
  };
}

function convertZodRecord(
  schema: z3.ZodRecord | z4.core.$ZodRecord,
  exportedSchemas: ExportedSchema[]
): RecordModel {
  const schemaDef =
    schema instanceof z4.core.$ZodRecord ? schema._zod.def : schema._def;

  return {
    type: 'record',
    keys: createModelOrRef(schemaDef.keyType, exportedSchemas),
    values: createModelOrRef(schemaDef.valueType, exportedSchemas),
  };
}

function convertZodTuple(
  schema: z3.ZodTuple | z4.core.$ZodTuple,
  exportedSchemas: ExportedSchema[]
): TupleModel {
  const schemaDef =
    schema instanceof z4.core.$ZodTuple ? schema._zod.def : schema._def;

  return {
    type: 'tuple',
    items: schemaDef.items.map(item => createModelOrRef(item, exportedSchemas)),
    ...(schemaDef.rest != null && {
      rest: createModelOrRef(schemaDef.rest, exportedSchemas),
    }),
  };
}

function convertZodFunction(
  schema:
    | z3.ZodFunction<z3.ZodTuple<any>, z3.ZodTypeAny>
    | z4.core.$ZodFunction,
  exportedSchemas: ExportedSchema[]
): FunctionModel {
  if (schema instanceof z4.core.$ZodFunction) {
    return {
      type: 'function',
      parameters:
        schema.def.input instanceof z4.core.$ZodTuple
          ? schema.def.input._zod.def.items.map(param =>
              createModelOrRef(param, exportedSchemas)
            )
          : [], // TODO: what about ZodArray?
      returnValue: createModelOrRef(schema.def.output, exportedSchemas),
    };
  }

  return {
    type: 'function',
    // TODO: support rest args? what about implicit `...unknown[]`?
    parameters: (schema._def.args.items as z3.ZodTypeAny[]).map(param =>
      createModelOrRef(param, exportedSchemas)
    ),
    returnValue: createModelOrRef(schema._def.returns, exportedSchemas),
  };
}

function convertZodPromise(
  schema: z3.ZodPromise<z3.ZodTypeAny> | z4.core.$ZodPromise,
  exportedSchemas: ExportedSchema[]
): PromiseModel {
  return {
    type: 'promise',
    resolvedValue: createModelOrRef(
      schema instanceof z4.core.$ZodPromise
        ? schema._zod.def.innerType
        : schema._def.type,
      exportedSchemas
    ),
  };
}

function convertZodLiteralOrUnion(
  schema: z3.ZodLiteral<z3.z.Primitive> | z4.core.$ZodLiteral
): LiteralModel | UnionModel {
  if (schema instanceof z4.core.$ZodLiteral) {
    if (schema._zod.def.values.length === 1) {
      return {
        type: 'literal',
        value: schema._zod.def.values[0],
      };
    }
    return {
      type: 'union',
      options: schema._zod.def.values.map(value => ({
        kind: 'model',
        model: { type: 'literal', value },
      })),
    };
  }

  return {
    type: 'literal',
    value: schema._def.value,
  };
}

function convertZodNull(schema: z3.ZodNull | z4.core.$ZodNull): NullModel {
  return {
    type: 'null',
  };
}

function convertZodUndefined(
  schema: z3.ZodUndefined | z4.core.$ZodUndefined
): UndefinedModel {
  return {
    type: 'undefined',
  };
}

function convertZodSymbol(
  schema: z3.ZodSymbol | z4.core.$ZodSymbol
): SymbolModel {
  return {
    type: 'symbol',
  };
}

function convertZodBigInt(
  schema: z3.ZodBigInt | z4.core.$ZodBigInt
): BigIntModel {
  if (schema instanceof z4.core.$ZodBigInt) {
    return {
      type: 'bigint',
      ...(schema._zod.def.checks?.length && {
        validations: schema._zod.def.checks
          .map((check): BigIntValidation | null => {
            if (check instanceof z4.core.$ZodCheckGreaterThan) {
              return [
                check._zod.def.inclusive ? 'gte' : 'gt',
                BigInt(check._zod.def.value.valueOf()),
              ];
            }
            if (check instanceof z4.core.$ZodCheckLessThan) {
              return [
                check._zod.def.inclusive ? 'lte' : 'lt',
                BigInt(check._zod.def.value.valueOf()),
              ];
            }
            if (check instanceof z4.core.$ZodCheckMultipleOf) {
              return ['multipleOf', BigInt(check._zod.def.value.valueOf())];
            }
            return null;
          })
          .filter(validation => validation != null),
      }),
    };
  }

  return {
    type: 'bigint',
    ...(schema._def.checks.length > 0 && {
      validations: schema._def.checks.map((check): BigIntValidation => {
        switch (check.kind) {
          case 'min':
            return [check.inclusive ? 'gte' : 'gt', check.value];
          case 'max':
            return [check.inclusive ? 'lte' : 'lt', check.value];
          case 'multipleOf':
            return [check.kind, check.value];
        }
      }),
    }),
  };
}

function convertZodUnknown(
  schema: z3.ZodUnknown | z4.core.$ZodUnknown
): UnknownModel {
  return {
    type: 'unknown',
  };
}

function convertZodAny(schema: z3.ZodAny | z4.core.$ZodAny): AnyModel {
  return {
    type: 'any',
  };
}

function convertZodVoid(schema: z3.ZodVoid | z4.core.$ZodVoid): VoidModel {
  return {
    type: 'void',
  };
}

function convertZodNever(schema: z3.ZodNever | z4.core.$ZodNever): NeverModel {
  return {
    type: 'never',
  };
}
