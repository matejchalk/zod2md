import { md } from 'build-md';
import { z } from 'zod';
import { MODELS } from '.';
import type { ExportedSchemas } from '../../types';
import { Renderer } from '../renderer';
import { FunctionModel } from './function';

function convertZodFunctionToSchema<T extends z.core.$ZodFunction>(factory: T) {
  return z
    .custom()
    .transform((arg, ctx) => {
      if (typeof arg !== 'function') {
        ctx.addIssue('Must be a function');
        return z.NEVER;
      }
      return factory.implement(arg as Parameters<T['implement']>[0]);
    })
    .meta({
      $ZodFunction: factory,
    });
}

describe('FunctionModel', () => {
  describe('isSchema', () => {
    it('should recognize type with function factory as metadata', () => {
      expect(
        new FunctionModel().isSchema(
          convertZodFunctionToSchema(
            z.function({ input: [z.string(), z.number()], output: z.boolean() })
          )
        )
      ).toBe(true);
    });

    it('should NOT recognize type without a function factory', () => {
      expect(new FunctionModel().isSchema(z.custom<() => string>())).toBe(
        false
      );
    });
  });

  describe('renderBlock', () => {
    it('should render function parameters', () => {
      const optionsSchema = z.object({});
      const schemas: ExportedSchemas = { Options: optionsSchema };
      expect(
        new FunctionModel().renderBlock(
          convertZodFunctionToSchema(
            z.function({ input: [z.string(), optionsSchema] })
          ),
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown(`
        _Function._

        _Parameters:_

        1. \`string\`
        2. [Options](#options)

        _Return value:_

        - \`unknown\`
      `);
    });

    it('should render function return value', () => {
      expect(
        new FunctionModel().renderBlock(
          convertZodFunctionToSchema(z.function({ output: z.void() })),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Function._

        _Parameters:_

        - _none_

        _Return value:_

        - \`void\`
      `);
    });
  });

  describe('renderInline', () => {
    it('should render function parameters and return value', () => {
      const optionsSchema = z.object({});
      const schemas: ExportedSchemas = { Options: optionsSchema };
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('callback'),
              new FunctionModel().renderInline(
                convertZodFunctionToSchema(
                  z.function({
                    input: [z.string(), optionsSchema],
                    output: z.void(),
                  })
                ),
                new Renderer(MODELS, schemas)
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property   | Type                                                                                                                                                                   |
        | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
        | \`callback\` | _Function:_<ul><li><i>parameters:</i> <ul><li><code>string</code></li><li><a href="#options">Options</a></li></ul></li><li><i>returns:</i> <code>void</code></li></ul> |
      `);
    });

    it('should render typescript code when possible', () => {
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('callback'),
              new FunctionModel().renderInline(
                convertZodFunctionToSchema(
                  z.function({
                    input: [z.array(z.string()), z.boolean()],
                    output: z.number(),
                  })
                ),
                new Renderer(MODELS, {})
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property   | Type                                 |
        | ---------- | ------------------------------------ |
        | \`callback\` | \`(Array<string>, boolean) => number\` |
      `);
    });
  });
});
