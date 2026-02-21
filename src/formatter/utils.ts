import { type BlockText, type FormattedText, type Mark, md } from 'build-md';

export function formatLiteral(value: unknown): string {
  switch (typeof value) {
    case 'string':
      return value.includes("'")
        ? `"${escapeQuotes(value, 'double')}"`
        : `'${escapeQuotes(value, 'single')}'`;
    case 'number':
    case 'boolean':
    case 'symbol':
    case 'bigint':
      return value.toString();
    case 'undefined':
      return 'undefined';
    case 'object':
      if (value == null) {
        return 'null';
      }
      return JSON.stringify(value);
    case 'function':
      return value.toString();
  }
}

function escapeQuotes(text: string, quotes: 'single' | 'double'): string {
  switch (quotes) {
    case 'single':
      return text.replace(/'/g, String.raw`\'`);
    case 'double':
      return text.replace(/"/g, String.raw`\"`);
  }
}

export function slugify(text: string): string {
  return text
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z\d-]/g, '');
}

export function smartJoin(items: string[], sep: string): string {
  return items.reduce((acc, item, idx) => {
    const link = idx === 0 ? '' : idx === items.length - 1 ? ` ${sep} ` : ', ';
    return acc + link + item;
  }, '');
}

export function smartJoinMd(items: BlockText[], sep: Mark): FormattedText {
  return items.reduce<FormattedText>((acc, item, idx) => {
    const link =
      idx === 0 ? '' : idx === items.length - 1 ? md` ${sep} ` : ', ';
    return md`${acc}${link}${item}`;
  }, []);
}

export function capitalize<T extends string>(text: T) {
  return `${text[0]?.toUpperCase() ?? ''}${text.slice(1)}` as Capitalize<T>;
}

export function uncapitalize<T extends string>(text: T) {
  return `${text[0]?.toLowerCase() ?? ''}${text.slice(1)}` as Uncapitalize<T>;
}
