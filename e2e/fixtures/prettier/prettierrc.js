import { z } from 'zod';

// source: https://json.schemastore.org/prettierrc

export const optionsSchema = z
  .object({
    arrowParens: z
      .union(
        [
          z.literal('always', {
            description: 'Always include parens. Example: `(x) => x`',
          }),
          z.literal('avoid', {
            description: 'Omit parens when possible. Example: `x => x`',
          }),
        ],
        {
          description:
            'Include parentheses around a sole arrow function parameter.',
        }
      )
      .default('always'),

    bracketSameLine: z
      .boolean({
        description:
          'Put > of opening tags on the last line instead of on a new line.',
      })
      .default(false),

    bracketSpacing: z
      .boolean({ description: 'Print spaces between brackets.' })
      .default(true),

    cursorOffset: z
      .number({
        description:
          'Print (to stderr) where a cursor at the given position would move to after formatting.',
      })
      .int()
      .default(-1),

    embeddedLanguageFormatting: z
      .union(
        [
          z.literal('auto', {
            description:
              'Format embedded code if Prettier can automatically identify it.',
          }),
          z.literal('off', {
            description: 'Never automatically format embedded code.',
          }),
        ],
        {
          description:
            'Control how Prettier formats quoted code embedded in the file.',
        }
      )
      .default('auto'),

    endOfLine: z
      .union(
        [
          z.literal('lf', {
            description:
              'Line Feed only (\\n), common on Linux and macOS as well as inside git repos',
          }),
          z.literal('crlf', {
            description:
              'Carriage Return + Line Feed characters (\\r\\n), common on Windows',
          }),
          z.literal('cr', {
            description:
              'Carriage Return character only (\\r), used very rarely',
          }),
          z.literal('auto', {
            description:
              "Maintain existing\n(mixed values within one file are normalised by looking at what's used after the first line)",
          }),
        ],
        { description: 'Which end of line characters to apply.' }
      )
      .default('lf'),

    experimentalTernaries: z
      .boolean({
        description:
          'Use curious ternaries, with the question mark after the condition.',
      })
      .default(false),

    filepath: z.string({
      description:
        'Specify the input filepath. This will be used to do parser inference.',
    }),

    htmlWhitespaceSensitivity: z
      .union(
        [
          z.literal('css', {
            description: 'Respect the default value of CSS display property.',
          }),
          z.literal('strict', {
            description: 'Whitespaces are considered sensitive.',
          }),
          z.literal('ignore', {
            description: 'Whitespaces are considered insensitive.',
          }),
        ],
        {
          description: 'How to handle whitespaces in HTML.',
        }
      )
      .default('css'),

    insertPragma: z
      .boolean({
        description:
          "Insert @format pragma into file's first docblock comment.",
      })
      .default(false),

    jsxSingleQuote: z
      .boolean({ description: 'Use single quotes in JSX.' })
      .default(false),

    parser: z.union(
      [
        z.literal('flow', { description: 'Flow' }),
        z.literal('babel', { description: 'JavaScript' }),
        z.literal('babel-flow', { description: 'Flow' }),
        z.literal('babel-ts', { description: 'TypeScript' }),
        z.literal('typescript', { description: 'TypeScript' }),
        z.literal('acorn', { description: 'JavaScript' }),
        z.literal('espree', { description: 'JavaScript' }),
        z.literal('meriyah', { description: 'JavaScript' }),
        z.literal('css', { description: 'CSS' }),
        z.literal('less', { description: 'Less' }),
        z.literal('scss', { description: 'SCSS' }),
        z.literal('json', { description: 'JSON' }),
        z.literal('json5', { description: 'JSON5' }),
        z.literal('jsonc', { description: 'JSON with Comments' }),
        z.literal('json-stringify', { description: 'JSON.stringify' }),
        z.literal('graphql', { description: 'GraphQL' }),
        z.literal('markdown', { description: 'Markdown' }),
        z.literal('mdx', { description: 'MDX' }),
        z.literal('vue', { description: 'Vue' }),
        z.literal('yaml', { description: 'YAML' }),
        z.literal('glimmer', { description: 'Ember / Handlebars' }),
        z.literal('html', { description: 'HTML' }),
        z.literal('angular', { description: 'Angular' }),
        z.literal('lwc', { description: 'Lightning Web Components' }),
        z.string({ description: 'Custom parser' }),
      ],
      { description: 'Which parser to use.' }
    ),

    plugins: z
      .array(z.string(), {
        description:
          'Add a plugin. Multiple plugins can be passed as separate `--plugin`s.',
      })
      .default([]),

    printWidth: z
      .number({ description: 'The line length where Prettier will try wrap.' })
      .int()
      .default(80),

    proseWrap: z
      .union(
        [
          z.literal('always', {
            description: 'Wrap prose if it exceeds the print width.',
          }),
          z.literal('never', { description: 'Do not wrap prose.' }),
          z.literal('preserve', { description: 'Wrap prose as-is.' }),
        ],
        {
          description: 'How to wrap prose.',
        }
      )
      .default('preserve'),

    quoteProps: z
      .union(
        [
          z.literal('as-needed', {
            description:
              'Only add quotes around object properties where required.',
          }),
          z.literal('consistent', {
            description:
              'If at least one property in an object requires quotes, quote all properties.',
          }),
          z.literal('preserve', {
            description:
              'Respect the input use of quotes in object properties.',
          }),
        ],
        { description: 'Change when properties in objects are quoted.' }
      )
      .default('as-needed'),

    rangeEnd: z
      .number({
        description:
          'Format code ending at a given character offset (exclusive).\nThe range will extend forwards to the end of the selected statement.',
      })
      .int()
      .nullable()
      .default(null),

    rangeStart: z
      .number({
        description:
          'Format code starting at a given character offset.\nThe range will extend backwards to the start of the first line containing the selected statement.',
      })
      .int()
      .default(0),

    requirePragma: z
      .boolean({
        description:
          "Require either '@prettier' or '@format' to be present in the file's first docblock comment\nin order for it to be formatted.",
      })
      .default(false),

    semi: z.boolean({ description: 'Print semicolons.' }).default(true),

    singleAttributePerLine: z
      .boolean({
        description: 'Enforce single attribute per line in HTML, Vue and JSX.',
      })
      .default(false),

    singleQuote: z
      .boolean({ description: 'Use single quotes instead of double quotes.' })
      .default(false),

    tabWidth: z
      .number({ description: 'Number of spaces per indentation level.' })
      .int()
      .default(2),

    trailingComma: z
      .union(
        [
          z.literal('all', {
            description:
              'Trailing commas wherever possible (including function arguments).',
          }),
          z.literal('es5', {
            description:
              'Trailing commas where valid in ES5 (objects, arrays, etc.)',
          }),
          z.literal('none', { description: 'No trailing commas.' }),
        ],
        {
          description:
            'Print trailing commas wherever possible when multi-line.',
        }
      )
      .default('all'),

    useTabs: z
      .boolean({ description: 'Indent with tabs instead of spaces.' })
      .default(false),

    vueIndentScriptAndStyle: z
      .boolean({ description: 'Indent script and style tags in Vue files.' })
      .default(false),
  })
  .partial();

export const overridesSchema = z.object({
  overrides: z.array(
    z.object({
      files: z.union([z.string(), z.array(z.string())], {
        description: 'Include these files in this override.',
      }),
      excludeFiles: z
        .union([z.string(), z.array(z.string())], {
          description: 'Exclude these files from this override.',
        })
        .optional(),
      options: optionsSchema
        // .describe('The options to apply for this override.')
        .optional(),
    }),
    {
      description:
        'Provide a list of patterns to override prettier configuration.',
    }
  ),
});

export const configSchema = optionsSchema.merge(overridesSchema);

export const prettierrcSchema = z.union([configSchema, z.string()], {
  description: 'Schema for .prettierrc',
});
