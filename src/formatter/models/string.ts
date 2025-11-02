import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { IModel } from '../types';
import { formatLiteral, smartJoin } from '../utils';

const STRING_TYPES = [
  z3.ZodString,
  z4.$ZodString,
  z4.$ZodEmail,
  z4.$ZodURL,
  z4.$ZodEmoji,
  z4.$ZodUUID,
  z4.$ZodCUID,
  z4.$ZodCUID2,
  z4.$ZodULID,
  z4.$ZodNanoID,
  z4.$ZodBase64,
  z4.$ZodBase64URL,
  z4.$ZodJWT,
  z4.$ZodISODate,
  z4.$ZodISOTime,
  z4.$ZodISODateTime,
  z4.$ZodISODuration,
  z4.$ZodIPv4,
  z4.$ZodIPv6,
  z4.$ZodCIDRv4,
  z4.$ZodCIDRv6,
] as const;
type StringType = InstanceType<(typeof STRING_TYPES)[number]>;

type StringValidation =
  | { kind: 'min'; value: number }
  | { kind: 'max'; value: number }
  | { kind: 'length'; value: number }
  | { kind: 'email' }
  | { kind: 'url' }
  | { kind: 'emoji' }
  | { kind: 'uuid' }
  | { kind: 'cuid' }
  | { kind: 'cuid2' }
  | { kind: 'ulid' }
  | { kind: 'nanoid' }
  | { kind: 'base64' }
  | { kind: 'base64url' }
  | { kind: 'jwt' }
  | { kind: 'date' }
  | { kind: 'time' }
  | { kind: 'duration' }
  | { kind: 'regex'; regex: RegExp }
  | { kind: 'includes'; value: string }
  | { kind: 'startsWith'; value: string }
  | { kind: 'endsWith'; value: string }
  | { kind: 'datetime'; offset: boolean; precision: number | null }
  | { kind: 'ip'; version?: 'v4' | 'v6' }
  | { kind: 'cidr'; version?: 'v4' | 'v6' };

export class StringModel implements IModel<StringType> {
  isSchema(schema: z3.ZodTypeAny | z4.$ZodType): schema is StringType {
    return STRING_TYPES.some(type => schema instanceof type);
  }

  renderBlock(schema: StringType): BlockText {
    const validations = this.#listValidations(schema);
    if (validations.length === 0) {
      return md.italic('String.');
    }
    return md.italic(
      `String that ${smartJoin(
        validations.map(this.#formatValidationLong),
        'and'
      )}.`
    );
  }

  renderInline(schema: StringType): InlineText {
    const validations = this.#listValidations(schema);
    if (validations.length === 0) {
      return md.code('string');
    }
    return md`${md.code('string')} (${md.italic(
      validations.map(this.#formatValidationShort).join(', ')
    )})`;
  }

  #formatValidationLong(validation: StringValidation): string {
    switch (validation.kind) {
      case 'email':
      case 'emoji':
        return `is an ${validation.kind}`;
      case 'url':
      case 'uuid':
      case 'cuid':
      case 'cuid2':
      case 'ulid':
      case 'nanoid':
      case 'base64':
      case 'base64url':
      case 'jwt':
        return `is a valid ${validation.kind.toUpperCase()}`;
      case 'date':
      case 'time':
      case 'duration':
        return `is a valid ${validation.kind}`;
      case 'min':
      case 'max':
        return `has a ${validation.kind}imum length of ${validation.value}`;
      case 'length':
        return `has an exact length of ${validation.value}`;
      case 'regex':
        return `matches the regular expression ${md.code(
          validation.regex.toString()
        )}`;
      case 'includes':
        return `includes the substring ${formatLiteral(validation.value)}`;
      case 'startsWith':
        return `starts with ${formatLiteral(validation.value)}`;
      case 'endsWith':
        return `ends with ${formatLiteral(validation.value)}`;
      case 'datetime':
        return `is a date and time in ISO 8601 format (${[
          validation.offset ? 'UTC' : 'any timezone offset',
          ...(validation.precision != null
            ? [`sub-second precision of ${validation.precision} decimal places`]
            : []),
        ].join(', ')})`;
      case 'ip':
        return `is in IP${validation.version ?? ''} address format`;
      case 'cidr':
        return `is in CIDR${validation.version ?? ''} address format`;
    }
  }

  #formatValidationShort(validation: StringValidation): string {
    switch (validation.kind) {
      case 'min':
      case 'max':
        return `${validation.kind} length: ${validation.value}`;
      case 'regex':
        return `${validation.kind}: ${md.code(validation.regex.toString())}`;
      case 'datetime':
        const options = [
          validation.offset ? '' : 'no timezone offset',
          validation.precision != null
            ? `${validation.precision} decimals sub-second precision`
            : '',
        ]
          .filter(Boolean)
          .join(' and ');
        return options ? 'ISO 8601' : `ISO 8601 - ${options}`;
      case 'ip':
        return `IP${validation.version ?? ''}`;
    }
    if ('value' in validation) {
      return `${validation.kind}: ${validation.value}`;
    }
    return validation.kind;
  }

  #listValidations(schema: StringType): StringValidation[] {
    if (schema instanceof z3.ZodString) {
      return schema._def.checks
        .map(this.#parseStringCheckV3)
        .filter(value => value != null);
    }

    return [
      this.#parseStringSubTypeV4(schema),
      ...(schema._zod.def.checks?.map(this.#parseStringCheckV4) ?? []),
    ].filter(value => value != null);
  }

  #parseStringCheckV3(check: z3.ZodStringCheck): StringValidation | null {
    switch (check.kind) {
      case 'toLowerCase':
      case 'toUpperCase':
      case 'trim':
        return null;
      default:
        return check;
    }
  }

  #parseStringCheckV4(check: z4.$ZodCheck): StringValidation | null {
    if (check instanceof z4.$ZodCheckMinLength) {
      return { kind: 'min', value: check._zod.def.minimum };
    }
    if (check instanceof z4.$ZodCheckMaxLength) {
      return { kind: 'max', value: check._zod.def.maximum };
    }
    if (check instanceof z4.$ZodCheckLengthEquals) {
      return { kind: 'length', value: check._zod.def.length };
    }
    if (check instanceof z4.$ZodCheckRegex) {
      return { kind: 'regex', regex: check._zod.def.pattern };
    }
    if (check instanceof z4.$ZodCheckIncludes) {
      return { kind: 'includes', value: check._zod.def.includes };
    }
    if (check instanceof z4.$ZodCheckStartsWith) {
      return { kind: 'startsWith', value: check._zod.def.prefix };
    }
    if (check instanceof z4.$ZodCheckEndsWith) {
      return { kind: 'endsWith', value: check._zod.def.suffix };
    }
    return this.#parseStringSubTypeV4(check);
  }

  #parseStringSubTypeV4(
    obj: Exclude<StringType, z3.ZodString> | z4.$ZodCheck
  ): StringValidation | null {
    if (obj instanceof z4.$ZodEmail) {
      return { kind: 'email' };
    }
    if (obj instanceof z4.$ZodURL) {
      return { kind: 'url' };
    }
    if (obj instanceof z4.$ZodEmoji) {
      return { kind: 'emoji' };
    }
    if (obj instanceof z4.$ZodUUID) {
      return { kind: 'uuid' };
    }
    if (obj instanceof z4.$ZodCUID) {
      return { kind: 'cuid' };
    }
    if (obj instanceof z4.$ZodCUID2) {
      return { kind: 'cuid2' };
    }
    if (obj instanceof z4.$ZodULID) {
      return { kind: 'ulid' };
    }
    if (obj instanceof z4.$ZodNanoID) {
      return { kind: 'nanoid' };
    }
    if (obj instanceof z4.$ZodBase64) {
      return { kind: 'base64' };
    }
    if (obj instanceof z4.$ZodBase64URL) {
      return { kind: 'base64url' };
    }
    if (obj instanceof z4.$ZodJWT) {
      return { kind: 'jwt' };
    }
    if (obj instanceof z4.$ZodISODate) {
      return { kind: 'date' };
    }
    if (obj instanceof z4.$ZodISOTime) {
      return { kind: 'time' };
    }
    if (obj instanceof z4.$ZodISODateTime) {
      return {
        kind: 'datetime',
        offset: obj._zod.def.offset,
        precision: obj._zod.def.precision,
      };
    }
    if (obj instanceof z4.$ZodISODuration) {
      return { kind: 'duration' };
    }
    if (obj instanceof z4.$ZodIPv4) {
      return { kind: 'ip', version: 'v4' };
    }
    if (obj instanceof z4.$ZodIPv6) {
      return { kind: 'ip', version: 'v6' };
    }
    if (obj instanceof z4.$ZodCIDRv4) {
      return { kind: 'cidr', version: 'v4' };
    }
    if (obj instanceof z4.$ZodCIDRv6) {
      return { kind: 'cidr', version: 'v6' };
    }
    return null;
  }
}
