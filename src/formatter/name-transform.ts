import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import path from 'node:path';
import type { NameTransformFn } from './types';

export const defaultNameTransform: NameTransformFn = (
  name,
  filePath,
  schema,
) => {
  const metaTitle = getMetaTitle(schema);
  if (metaTitle) {
    return metaTitle;
  }

  if (name) {
    return formatName(name);
  }

  const fileWithoutExt = path.basename(filePath).replace(/\.[cm]?[jt]sx?$/, '');
  if (fileWithoutExt !== 'index') {
    return formatName(fileWithoutExt);
  }
  const parentDir = path.dirname(filePath).split(path.sep).at(-1) ?? filePath;
  return formatName(parentDir);
};

const getMetaTitle = (schema: z4.$ZodType | z3.ZodTypeAny) => {
  if (schema instanceof z4.$ZodType) {
    return z4.globalRegistry.get(schema)?.title;
  }
};

const formatName = (name: string) => {
  const converters: ConverterFn[] = [
    kebabCaseToCamelCase,
    snakeCaseToCamelCase,
    dotCaseToCamelCase,
    stripSchemaSuffix,
    removeNonAlphaNumeric,
    capitalize,
  ];
  return converters.reduce((acc, convert) => convert(acc), name);
};

type ConverterFn = (str: string) => string;

const kebabCaseToCamelCase: ConverterFn = (str: string) =>
  str.replace(/-./g, c => c[1]?.toUpperCase() ?? '');

const snakeCaseToCamelCase: ConverterFn = (str: string) =>
  str.replace(/_./g, c => c[1]?.toUpperCase() ?? '');

const dotCaseToCamelCase: ConverterFn = (str: string) =>
  str.replace(/\../g, c => c[1]?.toUpperCase() ?? '');

const stripSchemaSuffix: ConverterFn = (str: string) =>
  str.replace(/schema$/i, '');

const removeNonAlphaNumeric: ConverterFn = (str: string) =>
  str.replace(/[^a-z\d]/gi, '');

const capitalize: ConverterFn = (str: string) =>
  (str[0]?.toUpperCase() ?? '') + str.slice(1);
