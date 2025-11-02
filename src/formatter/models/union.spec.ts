import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { UnionModel } from './union';

describe('UnionModel', () => {
  describe('renderBlock', () => {
    it('should render list of types', () => {
      expect(
        new UnionModel().renderBlock(
          z.union([
            z.array(z.string()),
            z.object({
              patterns: z.array(z.string()),
              config: z.string().optional(),
            }),
          ]),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Union of the following possible types:_
        
        - \`Array<string>\`
        - _Object with properties:_
          - **\`patterns\`** (\\*): \`Array<string>\`
          - \`config\`: \`string\`
      `);
    });

    it('should render links to type', () => {
      const optionsSchema = z.object({
        patterns: z.array(z.string()),
        config: z.string().optional(),
      });
      const inputSchema = z.union([z.array(z.string()), optionsSchema]);
      const schemas = { Options: optionsSchema, Input: inputSchema };
      expect(
        new UnionModel().renderBlock(inputSchema, new Renderer(MODELS, schemas))
      ).toEqualMarkdown(`
        _Union of the following possible types:_
        
        - \`Array<string>\`
        - [Options](#options)
      `);
    });
  });

  describe('renderInline', () => {
    it('should render sentence with list of options', () => {
      const optionsSchema = z.object({
        patterns: z.array(z.string()),
        config: z.string().optional(),
      });
      const inputSchema = z.union([z.array(z.string()), optionsSchema]);
      const schemas = { Options: optionsSchema, Input: inputSchema };
      expect(
        new UnionModel().renderInline(
          inputSchema,
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown('`Array<string>` _or_ [Options](#options)');
    });

    it('should render typescript union type for primtive options', () => {
      expect(
        new UnionModel().renderInline(
          z.union([z.number(), z.enum(['auto', 'full'])]),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown("`number | 'auto' | 'full'`");
    });
  });
});
