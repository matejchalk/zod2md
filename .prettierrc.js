/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'all',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['<THIRD_PARTY_MODULES>', '<BUILTIN_MODULES>', '^[./]'],
  importOrderSortSpecifiers: true,
};

export default config;
