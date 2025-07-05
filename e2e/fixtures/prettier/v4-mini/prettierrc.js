import * as z from 'zod/v4-mini';

// source: https://json.schemastore.org/prettierrc

export const optionsSchema = z.partial(
  z.object({
    arrowParens: z
      ._default(
        z.union([
          z.literal('always').register(z.globalRegistry, {
            description: 'Always include parens. Example: `(x) => x`',
          }),
          z.literal('avoid').register(z.globalRegistry, {
            description: 'Omit parens when possible. Example: `x => x`',
          }),
        ]),
        'always'
      )
      .register(z.globalRegistry, {
        description:
          'Include parentheses around a sole arrow function parameter.',
      }),

    bracketSameLine: z._default(z.boolean(), false).register(z.globalRegistry, {
      description:
        'Put > of opening tags on the last line instead of on a new line.',
    }),

    bracketSpacing: z._default(z.boolean(), true).register(z.globalRegistry, {
      description: 'Print spaces between brackets.',
    }),

    cursorOffset: z
      ._default(z.number().check(z.int()), -1)
      .register(z.globalRegistry, {
        description:
          'Print (to stderr) where a cursor at the given position would move to after formatting.',
      }),

    embeddedLanguageFormatting: z
      ._default(
        z.union([
          z.literal('auto').register(z.globalRegistry, {
            description:
              'Format embedded code if Prettier can automatically identify it.',
          }),
          z.literal('off').register(z.globalRegistry, {
            description: 'Never automatically format embedded code.',
          }),
        ]),
        'auto'
      )
      .register(z.globalRegistry, {
        description:
          'Control how Prettier formats quoted code embedded in the file.',
      }),

    endOfLine: z
      ._default(
        z.union([
          z.literal('lf').register(z.globalRegistry, {
            description:
              'Line Feed only (\\n), common on Linux and macOS as well as inside git repos',
          }),
          z.literal('crlf').register(z.globalRegistry, {
            description:
              'Carriage Return + Line Feed characters (\\r\\n), common on Windows',
          }),
          z.literal('cr').register(z.globalRegistry, {
            description:
              'Carriage Return character only (\\r), used very rarely',
          }),
          z.literal('auto').register(z.globalRegistry, {
            description:
              "Maintain existing\n(mixed values within one file are normalised by looking at what's used after the first line)",
          }),
        ]),
        'lf'
      )
      .register(z.globalRegistry, {
        description: 'Which end of line characters to apply.',
      }),

    experimentalTernaries: z
      ._default(z.boolean(), false)
      .register(z.globalRegistry, {
        description:
          'Use curious ternaries, with the question mark after the condition.',
      }),

    filepath: z.string().register(z.globalRegistry, {
      description:
        'Specify the input filepath. This will be used to do parser inference.',
    }),

    htmlWhitespaceSensitivity: z
      ._default(
        z.union([
          z.literal('css').register(z.globalRegistry, {
            description: 'Respect the default value of CSS display property.',
          }),
          z.literal('strict').register(z.globalRegistry, {
            description: 'Whitespaces are considered sensitive.',
          }),
          z.literal('ignore').register(z.globalRegistry, {
            description: 'Whitespaces are considered insensitive.',
          }),
        ]),
        'css'
      )
      .register(z.globalRegistry, {
        description: 'How to handle whitespaces in HTML.',
      }),

    insertPragma: z._default(z.boolean(), false).register(z.globalRegistry, {
      description: "Insert @format pragma into file's first docblock comment.",
    }),

    jsxSingleQuote: z
      ._default(z.boolean(), false)
      .register(z.globalRegistry, { description: 'Use single quotes in JSX.' }),

    parser: z
      .union([
        z.literal('flow').register(z.globalRegistry, { description: 'Flow' }),
        z
          .literal('babel')
          .register(z.globalRegistry, { description: 'JavaScript' }),
        z
          .literal('babel-flow')
          .register(z.globalRegistry, { description: 'Flow' }),
        z
          .literal('babel-ts')
          .register(z.globalRegistry, { description: 'TypeScript' }),
        z
          .literal('typescript')
          .register(z.globalRegistry, { description: 'TypeScript' }),
        z
          .literal('acorn')
          .register(z.globalRegistry, { description: 'JavaScript' }),
        z
          .literal('espree')
          .register(z.globalRegistry, { description: 'JavaScript' }),
        z
          .literal('meriyah')
          .register(z.globalRegistry, { description: 'JavaScript' }),
        z.literal('css').register(z.globalRegistry, { description: 'CSS' }),
        z.literal('less').register(z.globalRegistry, { description: 'Less' }),
        z.literal('scss').register(z.globalRegistry, { description: 'SCSS' }),
        z.literal('json').register(z.globalRegistry, { description: 'JSON' }),
        z.literal('json5').register(z.globalRegistry, { description: 'JSON5' }),
        z
          .literal('jsonc')
          .register(z.globalRegistry, { description: 'JSON with Comments' }),
        z
          .literal('json-stringify')
          .register(z.globalRegistry, { description: 'JSON.stringify' }),
        z
          .literal('graphql')
          .register(z.globalRegistry, { description: 'GraphQL' }),
        z
          .literal('markdown')
          .register(z.globalRegistry, { description: 'Markdown' }),
        z.literal('mdx').register(z.globalRegistry, { description: 'MDX' }),
        z.literal('vue').register(z.globalRegistry, { description: 'Vue' }),
        z.literal('yaml').register(z.globalRegistry, { description: 'YAML' }),
        z
          .literal('glimmer')
          .register(z.globalRegistry, { description: 'Ember / Handlebars' }),
        z.literal('html').register(z.globalRegistry, { description: 'HTML' }),
        z
          .literal('angular')
          .register(z.globalRegistry, { description: 'Angular' }),
        z.literal('lwc').register(z.globalRegistry, {
          description: 'Lightning Web Components',
        }),
        z.string().register(z.globalRegistry, { description: 'Custom parser' }),
      ])
      .register(z.globalRegistry, { description: 'Which parser to use.' }),

    plugins: z._default(z.array(z.string()), []).register(z.globalRegistry, {
      description:
        'Add a plugin. Multiple plugins can be passed as separate `--plugin`s.',
    }),

    printWidth: z
      ._default(z.number().check(z.int()), 80)
      .register(z.globalRegistry, {
        description: 'The line length where Prettier will try wrap.',
      }),

    proseWrap: z
      ._default(
        z.union([
          z.literal('always').register(z.globalRegistry, {
            description: 'Wrap prose if it exceeds the print width.',
          }),
          z
            .literal('never')
            .register(z.globalRegistry, { description: 'Do not wrap prose.' }),
          z
            .literal('preserve')
            .register(z.globalRegistry, { description: 'Wrap prose as-is.' }),
        ]),
        'preserve'
      )
      .register(z.globalRegistry, {
        description: 'How to wrap prose.',
      }),

    quoteProps: z
      ._default(
        z.union([
          z.literal('as-needed').register(z.globalRegistry, {
            description:
              'Only add quotes around object properties where required.',
          }),
          z.literal('consistent').register(z.globalRegistry, {
            description:
              'If at least one property in an object requires quotes, quote all properties.',
          }),
          z.literal('preserve').register(z.globalRegistry, {
            description:
              'Respect the input use of quotes in object properties.',
          }),
        ]),
        'as-needed'
      )
      .register(z.globalRegistry, {
        description: 'Change when properties in objects are quoted.',
      }),

    rangeEnd: z
      ._default(z.nullable(z.number().check(z.int())), null)
      .register(z.globalRegistry, {
        description:
          'Format code ending at a given character offset (exclusive).\nThe range will extend forwards to the end of the selected statement.',
      }),

    rangeStart: z
      ._default(z.number().check(z.int()), 0)
      .register(z.globalRegistry, {
        description:
          'Format code starting at a given character offset.\nThe range will extend backwards to the start of the first line containing the selected statement.',
      }),

    requirePragma: z._default(z.boolean(), false).register(z.globalRegistry, {
      description:
        "Require either '@prettier' or '@format' to be present in the file's first docblock comment\nin order for it to be formatted.",
    }),

    semi: z
      ._default(z.boolean(), true)
      .register(z.globalRegistry, { description: 'Print semicolons.' }),

    singleAttributePerLine: z
      ._default(z.boolean(), false)
      .register(z.globalRegistry, {
        description: 'Enforce single attribute per line in HTML, Vue and JSX.',
      }),

    singleQuote: z._default(z.boolean(), false).register(z.globalRegistry, {
      description: 'Use single quotes instead of double quotes.',
    }),

    tabWidth: z
      ._default(z.number().check(z.int()), 2)
      .register(z.globalRegistry, {
        description: 'Number of spaces per indentation level.',
      }),

    trailingComma: z
      ._default(
        z.union([
          z.literal('all').register(z.globalRegistry, {
            description:
              'Trailing commas wherever possible (including function arguments).',
          }),
          z.literal('es5').register(z.globalRegistry, {
            description:
              'Trailing commas where valid in ES5 (objects, arrays, etc.)',
          }),
          z
            .literal('none')
            .register(z.globalRegistry, { description: 'No trailing commas.' }),
        ]),
        'all'
      )
      .register(z.globalRegistry, {
        description: 'Print trailing commas wherever possible when multi-line.',
      }),

    useTabs: z._default(z.boolean(), false).register(z.globalRegistry, {
      description: 'Indent with tabs instead of spaces.',
    }),

    vueIndentScriptAndStyle: z
      ._default(z.boolean(), false)
      .register(z.globalRegistry, {
        description: 'Indent script and style tags in Vue files.',
      }),
    // ...existing code...
  })
);

export const overridesSchema = z.object({
  overrides: z
    .array(
      z.object({
        files: z
          .union([z.string(), z.array(z.string())])
          .register(z.globalRegistry, {
            description: 'Include these files in this override.',
          }),
        excludeFiles: z
          .optional(z.union([z.string(), z.array(z.string())]))
          .register(z.globalRegistry, {
            description: 'Exclude these files from this override.',
          }),
        options: z.optional(optionsSchema).register(z.globalRegistry, {
          description: 'The options to apply for this override.',
        }),
      })
    )
    .register(z.globalRegistry, {
      description:
        'Provide a list of patterns to override prettier configuration.',
    }),
});

export const configSchema = z.extend(
  optionsSchema,
  overridesSchema._zod.def.shape
);

export const prettierrcSchema = z
  .union([configSchema, z.string()])
  .register(z.globalRegistry, {
    description: 'Schema for .prettierrc',
  });
