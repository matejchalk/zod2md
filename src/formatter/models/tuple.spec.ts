import { md } from 'build-md';
import { z } from 'zod';
import { MODELS } from '.';
import type { ExportedSchemas } from '../../types';
import { Renderer } from '../renderer';
import { TupleModel } from './tuple';

describe('TupleModel', () => {
  describe('renderBlock', () => {
    it('should render list of tuple items', () => {
      const userSchema = z.object({});
      const schemas: ExportedSchemas = { User: userSchema };

      expect(
        new TupleModel().renderBlock(
          z.tuple([z.string(), userSchema]),
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown(`
        _Tuple, array of 2 items:_

        1. \`string\`
        2. [User](#user)
      `);
    });

    it('should include rest items', () => {
      expect(
        new TupleModel().renderBlock(
          z.tuple([z.number(), z.number(), z.boolean()], z.string()),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Tuple, array of 3+ items:_

        1. \`number\`
        2. \`number\`
        3. \`boolean\`

        _... followed by a variable number of_ \`string\` _items_.
      `);
    });
  });

  describe('renderInline', () => {
    it('should render list of tuple items', () => {
      const userSchema = z.object({});
      const schemas: ExportedSchemas = { User: userSchema };

      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('userRow'),
              new TupleModel().renderInline(
                z.tuple([z.string(), userSchema]),
                new Renderer(MODELS, schemas)
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property  | Type                                                                           |
        | --------- | ------------------------------------------------------------------------------ |
        | \`userRow\` | _Tuple:_<ol><li><code>string</code></li><li><a href="#user">User</a></li></ol> |
      `);
    });

    it('should include named rest items', () => {
      const userSchema = z.object({});
      const schemas: ExportedSchemas = { User: userSchema };

      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('userRow'),
              new TupleModel().renderInline(
                z.tuple([z.string(), userSchema], userSchema),
                new Renderer(MODELS, schemas)
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property  | Type                                                                                                                         |
        | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
        | \`userRow\` | _Tuple:_<ol><li><code>string</code></li><li><a href="#user">User</a></li></ol>_+ a variable number of_ [User](#user) _items_ |
      `);
    });

    it('should render typescript code if possible', () => {
      expect(
        new TupleModel().renderInline(
          z.tuple([z.enum(['error', 'warning', 'info']), z.number()]),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown("`['error' | 'warning' | 'info', number]`");
    });

    it('should include rest items in typescript code', () => {
      expect(
        new TupleModel().renderInline(
          z.tuple([z.number(), z.number(), z.boolean()], z.string()),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`[number, number, boolean, ...string[]]`');
    });
  });
});
