import { z } from 'zod/v4';

// source: https://json.schemastore.org/prettierrc

export const optionsSchema = z
  .object({
    arrowParens: z
      .union([
        z.literal('always').meta({
          description: 'Always include parens. Example: `(x) => x`',
        }),
        z.literal('avoid').meta({
          description: 'Omit parens when possible. Example: `x => x`',
        }),
      ])
      .default('always')
      .meta({
        description:
          'Include parentheses around a sole arrow function parameter.',
      }),

    bracketSameLine: z.boolean().default(false).meta({
      description:
        'Put > of opening tags on the last line instead of on a new line.',
    }),

    bracketSpacing: z
      .boolean()
      .default(true)
      .meta({ description: 'Print spaces between brackets.' }),

    cursorOffset: z.number().int().default(-1).meta({
      description:
        'Print (to stderr) where a cursor at the given position would move to after formatting.',
    }),

    embeddedLanguageFormatting: z
      .union([
        z.literal('auto').meta({
          description:
            'Format embedded code if Prettier can automatically identify it.',
        }),
        z.literal('off').meta({
          description: 'Never automatically format embedded code.',
        }),
      ])
      .default('auto')
      .meta({
        description:
          'Control how Prettier formats quoted code embedded in the file.',
      }),

    endOfLine: z
      .union([
        z.literal('lf').meta({
          description:
            'Line Feed only (\\n), common on Linux and macOS as well as inside git repos',
        }),
        z.literal('crlf').meta({
          description:
            'Carriage Return + Line Feed characters (\\r\\n), common on Windows',
        }),
        z.literal('cr').meta({
          description: 'Carriage Return character only (\\r), used very rarely',
        }),
        z.literal('auto').meta({
          description:
            "Maintain existing\n(mixed values within one file are normalised by looking at what's used after the first line)",
        }),
      ])
      .default('lf')
      .meta({ description: 'Which end of line characters to apply.' }),

    experimentalTernaries: z.boolean().default(false).meta({
      description:
        'Use curious ternaries, with the question mark after the condition.',
    }),

    filepath: z.string().meta({
      description:
        'Specify the input filepath. This will be used to do parser inference.',
    }),

    htmlWhitespaceSensitivity: z
      .union([
        z.literal('css').meta({
          description: 'Respect the default value of CSS display property.',
        }),
        z.literal('strict').meta({
          description: 'Whitespaces are considered sensitive.',
        }),
        z.literal('ignore').meta({
          description: 'Whitespaces are considered insensitive.',
        }),
      ])
      .default('css')
      .meta({
        description: 'How to handle whitespaces in HTML.',
      }),

    insertPragma: z.boolean().default(false).meta({
      description: "Insert @format pragma into file's first docblock comment.",
    }),

    jsxSingleQuote: z
      .boolean()
      .default(false)
      .meta({ description: 'Use single quotes in JSX.' }),

    parser: z
      .union([
        z.literal('flow').meta({ description: 'Flow' }),
        z.literal('babel').meta({ description: 'JavaScript' }),
        z.literal('babel-flow').meta({ description: 'Flow' }),
        z.literal('babel-ts').meta({ description: 'TypeScript' }),
        z.literal('typescript').meta({ description: 'TypeScript' }),
        z.literal('acorn').meta({ description: 'JavaScript' }),
        z.literal('espree').meta({ description: 'JavaScript' }),
        z.literal('meriyah').meta({ description: 'JavaScript' }),
        z.literal('css').meta({ description: 'CSS' }),
        z.literal('less').meta({ description: 'Less' }),
        z.literal('scss').meta({ description: 'SCSS' }),
        z.literal('json').meta({ description: 'JSON' }),
        z.literal('json5').meta({ description: 'JSON5' }),
        z.literal('jsonc').meta({ description: 'JSON with Comments' }),
        z.literal('json-stringify').meta({ description: 'JSON.stringify' }),
        z.literal('graphql').meta({ description: 'GraphQL' }),
        z.literal('markdown').meta({ description: 'Markdown' }),
        z.literal('mdx').meta({ description: 'MDX' }),
        z.literal('vue').meta({ description: 'Vue' }),
        z.literal('yaml').meta({ description: 'YAML' }),
        z.literal('glimmer').meta({ description: 'Ember / Handlebars' }),
        z.literal('html').meta({ description: 'HTML' }),
        z.literal('angular').meta({ description: 'Angular' }),
        z.literal('lwc').meta({ description: 'Lightning Web Components' }),
        z.string().meta({ description: 'Custom parser' }),
      ])
      .meta({ description: 'Which parser to use.' }),

    plugins: z.array(z.string()).default([]).meta({
      description:
        'Add a plugin. Multiple plugins can be passed as separate `--plugin`s.',
    }),

    printWidth: z
      .number()
      .int()
      .default(80)
      .meta({ description: 'The line length where Prettier will try wrap.' }),

    proseWrap: z
      .union([
        z.literal('always').meta({
          description: 'Wrap prose if it exceeds the print width.',
        }),
        z.literal('never').meta({ description: 'Do not wrap prose.' }),
        z.literal('preserve').meta({ description: 'Wrap prose as-is.' }),
      ])
      .default('preserve')
      .meta({
        description: 'How to wrap prose.',
      }),

    quoteProps: z
      .union([
        z.literal('as-needed').meta({
          description:
            'Only add quotes around object properties where required.',
        }),
        z.literal('consistent').meta({
          description:
            'If at least one property in an object requires quotes, quote all properties.',
        }),
        z.literal('preserve').meta({
          description: 'Respect the input use of quotes in object properties.',
        }),
      ])
      .default('as-needed')
      .meta({ description: 'Change when properties in objects are quoted.' }),

    rangeEnd: z.number().int().nullable().default(null).meta({
      description:
        'Format code ending at a given character offset (exclusive).\nThe range will extend forwards to the end of the selected statement.',
    }),

    rangeStart: z.number().int().default(0).meta({
      description:
        'Format code starting at a given character offset.\nThe range will extend backwards to the start of the first line containing the selected statement.',
    }),

    requirePragma: z.boolean().default(false).meta({
      description:
        "Require either '@prettier' or '@format' to be present in the file's first docblock comment\nin order for it to be formatted.",
    }),

    semi: z.boolean().default(true).meta({ description: 'Print semicolons.' }),

    singleAttributePerLine: z.boolean().default(false).meta({
      description: 'Enforce single attribute per line in HTML, Vue and JSX.',
    }),

    singleQuote: z
      .boolean()
      .default(false)
      .meta({ description: 'Use single quotes instead of double quotes.' }),

    tabWidth: z
      .number()
      .int()
      .default(2)
      .meta({ description: 'Number of spaces per indentation level.' }),

    trailingComma: z
      .union([
        z.literal('all').meta({
          description:
            'Trailing commas wherever possible (including function arguments).',
        }),
        z.literal('es5').meta({
          description:
            'Trailing commas where valid in ES5 (objects, arrays, etc.)',
        }),
        z.literal('none').meta({ description: 'No trailing commas.' }),
      ])
      .default('all')
      .meta({
        description: 'Print trailing commas wherever possible when multi-line.',
      }),

    useTabs: z
      .boolean()
      .default(false)
      .meta({ description: 'Indent with tabs instead of spaces.' }),

    vueIndentScriptAndStyle: z
      .boolean()
      .default(false)
      .meta({ description: 'Indent script and style tags in Vue files.' }),
  })
  .partial();

export const overridesSchema = z.object({
  overrides: z
    .array(
      z.object({
        files: z
          .union([z.string(), z.array(z.string())])
          .meta({ description: 'Include these files in this override.' }),
        excludeFiles: z
          .union([z.string(), z.array(z.string())])
          .optional()
          .meta({ description: 'Exclude these files from this override.' }),
        options: optionsSchema
          .optional()
          .meta({ description: 'The options to apply for this override.' }),
      })
    )
    .meta({
      description:
        'Provide a list of patterns to override prettier configuration.',
    }),
});

export const configSchema = z.object({
  ...optionsSchema.shape,
  ...overridesSchema.shape,
});

export const prettierrcSchema = z.union([configSchema, z.string()]).meta({
  description: 'Schema for .prettierrc',
});
