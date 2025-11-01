export function formatLiteral(value: unknown): string {
  switch (typeof value) {
    case 'string':
      return value.includes("'")
        ? `"${value.replace(/"/g, '\\"')}"`
        : `'${value.replace(/'/g, "\\'")}'`;
    case 'number':
    case 'boolean':
    case 'symbol':
    case 'bigint':
      return value.toString();
    case 'undefined':
      return 'undefined';
    case 'object':
      if (value === null) {
        return 'null';
      }
      return JSON.stringify(value);
    case 'function':
      return value.toString();
  }
}

export function slugify(text: string): string {
  return text
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

export function smartJoin(items: string[], sep: string): string {
  return items.reduce((acc, item, idx) => {
    const link = idx === 0 ? '' : idx === items.length - 1 ? ` ${sep} ` : ', ';
    return acc + link + item;
  }, '');
}

export function capitalize<T extends string>(text: T) {
  return `${text[0]?.toUpperCase() ?? ''}${text.slice(1)}` as Capitalize<T>;
}

export function uncapitalize<T extends string>(text: T) {
  return `${text[0]?.toLowerCase() ?? ''}${text.slice(1)}` as Uncapitalize<T>;
}
