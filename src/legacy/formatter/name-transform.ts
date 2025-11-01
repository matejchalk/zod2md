import { basename, dirname, sep } from 'node:path';
import type { NameTransformFn } from './types';

export const defaultNameTransform: NameTransformFn = (name, path) => {
  if (name) {
    return formatName(name);
  }
  const fileWithoutExt = basename(path).replace(/\.[cm]?[jt]sx?$/, '');
  if (fileWithoutExt !== 'index') {
    return formatName(fileWithoutExt);
  }
  const parentDir = dirname(path).split(sep).at(-1)!;
  return formatName(parentDir);
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
  str.replace(/[^a-z0-9]/gi, '');

const capitalize: ConverterFn = (str: string) =>
  (str[0]?.toUpperCase() ?? '') + str.slice(1);
