import { md } from 'build-md';
import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { ObjectModel } from './object';

describe('ObjectModel', () => {
  describe('renderBlock', () => {
    it('should render table with property and type columns', () => {
      expect(
        new ObjectModel().renderBlock(
          z.object({
            cache: z.boolean().optional(),
            logs: z.enum(['error', 'warning', 'info', 'debug']).optional(),
          }),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Object containing the following properties:_

        | Property | Type                                        |
        | :------- | :------------------------------------------ |
        | \`cache\`  | \`boolean\`                                   |
        | \`logs\`   | \`'error' \\| 'warning' \\| 'info' \\| 'debug'\` |

        _All properties are optional._
      `);
    });

    it('should render links to other schemas', () => {
      const logLevelSchema = z.enum(['error', 'warning', 'info', 'debug']);
      const loggerConfigSchema = z.object({
        level: logLevelSchema.optional(),
      });
      const schemas = {
        LogLevel: logLevelSchema,
        LoggerConfig: loggerConfigSchema,
      };
      expect(
        new ObjectModel().renderBlock(
          loggerConfigSchema,
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown(`
        _Object containing the following properties:_

        | Property | Type                  |
        | :------- | :-------------------- |
        | \`level\`  | [LogLevel](#loglevel) |

        _All properties are optional._
      `);
    });

    it('should mark required properties', () => {
      expect(
        new ObjectModel().renderBlock(
          z.object({ x: z.number(), y: z.number(), z: z.number().optional() }),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Object containing the following properties:_

        | Property     | Type     |
        | :----------- | :------- |
        | **\`x\`** (\\*) | \`number\` |
        | **\`y\`** (\\*) | \`number\` |
        | \`z\`          | \`number\` |

        _(\\*) Required._
      `);
    });

    it('should include descriptions column if available', () => {
      expect(
        new ObjectModel().renderBlock(
          z.object({
            format: z.enum(['esm', 'cjs']).optional().describe('Module format'),
            tsconfig: z.string().describe('Path to `tsconfig.json`').optional(),
          }),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Object containing the following properties:_

        | Property   | Description             | Type             |
        | :--------- | :---------------------- | :--------------- |
        | \`format\`   | Module format           | \`'esm' \\| 'cjs'\` |
        | \`tsconfig\` | Path to \`tsconfig.json\` | \`string\`         |

        _All properties are optional._
      `);
    });

    it('should include default column if available', () => {
      expect(
        new ObjectModel().renderBlock(
          z.object({
            format: z.enum(['esm', 'cjs']).optional(),
            tsconfig: z.string().default('tsconfig.json'),
          }),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Object containing the following properties:_

        | Property   | Type             | Default           |
        | :--------- | :--------------- | :---------------- |
        | \`format\`   | \`'esm' \\| 'cjs'\` |                   |
        | \`tsconfig\` | \`string\`         | \`'tsconfig.json'\` |

        _All properties are optional._
      `);
    });
  });

  describe('renderInline', () => {
    it('should render list of properties', () => {
      const logLevelSchema = z.enum(['error', 'warning', 'info', 'debug']);
      const loggerConfigSchema = z.object({
        level: logLevelSchema.optional(),
      });
      const schemas = {
        LogLevel: logLevelSchema,
        LoggerConfig: loggerConfigSchema,
      };
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('logs'),
              new ObjectModel().renderInline(
                loggerConfigSchema,
                new Renderer(MODELS, schemas)
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property | Type                                                                                            |
        | -------- | ----------------------------------------------------------------------------------------------- |
        | \`logs\`   | _Object with properties:_<ul><li><code>level</code>: <a href="#loglevel">LogLevel</a></li></ul> |
      `);
    });

    it('should mark required properties and include descriptions', () => {
      const logLevelSchema = z.enum(['error', 'warning', 'info', 'debug']);
      const loggerConfigSchema = z.object({
        level: logLevelSchema.meta({ description: 'Minimum log level' }),
      });
      const schemas = {
        LogLevel: logLevelSchema,
        LoggerConfig: loggerConfigSchema,
      };
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('logs'),
              new ObjectModel().renderInline(
                loggerConfigSchema,
                new Renderer(MODELS, schemas)
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property | Type                                                                                                                            |
        | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
        | \`logs\`   | _Object with properties:_<ul><li><b><code>level</code></b> (\\*): <a href="#loglevel">LogLevel</a> - Minimum log level</li></ul> |
      `);
    });
  });
});
