import { md } from 'build-md';
import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { ArrayModel } from './array';

describe('ArrayModel', () => {
  describe('renderBlock', () => {
    it('should render array with exported item schema', () => {
      const itemSchema = z.object({ id: z.uuid(), name: z.string() });
      const arraySchema = z.array(itemSchema);
      const schemas = { Product: itemSchema, Products: arraySchema };
      expect(
        new ArrayModel().renderBlock(arraySchema, new Renderer(MODELS, schemas))
      ).toEqualMarkdown('_Array of [Product](#product) items._');
    });

    it('should render array with non-exported object schema', () => {
      const arraySchema = z.array(
        z.object({ id: z.string(), name: z.string() })
      );
      const schemas = { Products: arraySchema };
      expect(
        new ArrayModel().renderBlock(arraySchema, new Renderer(MODELS, schemas))
      ).toEqualMarkdown(`
        _Array of objects containing the following properties:_
        
        | Property        | Type     |
        | --------------- | -------- |
        | **\`id\`** (\\*)   | \`string\` |
        | **\`name\`** (\\*) | \`string\` |
        
        _(\\*) Required._
      `);
    });

    it('should include validations', () => {
      const arraySchema = z.array(z.string()).min(1);
      expect(
        new ArrayModel().renderBlock(arraySchema, new Renderer(MODELS, {}))
      ).toEqualMarkdown('_Array of at least 1_ `string` _item._');
    });

    it('should render array of arrays', () => {
      const arraySchema = z.array(z.array(z.boolean()));
      expect(
        new ArrayModel().renderBlock(arraySchema, new Renderer(MODELS, {}))
      ).toEqualMarkdown('_Array of_ `Array<boolean>` _items._');
    });
  });

  describe('renderInline', () => {
    it('should render array with exported item schema', () => {
      const itemSchema = z.object({ id: z.uuid(), name: z.string() });
      const arraySchema = z.array(itemSchema);
      const schemas = { Product: itemSchema, Products: arraySchema };
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('products'),
              new ArrayModel().renderInline(
                arraySchema,
                new Renderer(MODELS, schemas)
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property   | Type                                   |
        | ---------- | -------------------------------------- |
        | \`products\` | _Array of_ [Product](#product) _items_ |
     `);
    });

    it('should render array with non-exported object schema', () => {
      const arraySchema = z.array(
        z.object({ id: z.string(), name: z.string() })
      );
      const schemas = { Products: arraySchema };
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('products'),
              new ArrayModel().renderInline(
                arraySchema,
                new Renderer(MODELS, schemas)
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property   | Type                                                                                                                                             |
        | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
        | \`products\` | _Array of objects:_<ul><li><b><code>id</code></b> (\\*): <code>string</code></li><li><b><code>name</code></b> (\\*): <code>string</code></li></ul> |
     `);
    });

    it('should render array with primitive item type', () => {
      const arraySchema = z.array(z.string());
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('tags'),
              new ArrayModel().renderInline(
                arraySchema,
                new Renderer(MODELS, {})
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property | Type            |
        | -------- | --------------- |
        | \`tags\`   | \`Array<string>\` |
     `);
    });

    it('should render array validations', () => {
      const arraySchema = z.array(z.string()).min(1).max(10);
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('filters'),
              new ArrayModel().renderInline(
                arraySchema,
                new Renderer(MODELS, {})
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property  | Type                                |
        | --------- | ----------------------------------- |
        | \`filters\` | \`Array<string>\` (_min: 1, max: 10_) |
     `);
    });

    it('should render array of arrays', () => {
      const arraySchema = z.array(z.array(z.boolean()));
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('matrix'),
              new ArrayModel().renderInline(
                arraySchema,
                new Renderer(MODELS, {})
              ),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property | Type                    |
        | -------- | ----------------------- |
        | \`matrix\` | \`Array<Array<boolean>>\` |
     `);
    });

    // TODO
    // it("should render array of items that don't serialize as inline code", () => {});
  });
});
