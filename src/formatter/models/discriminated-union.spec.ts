import { z } from 'zod';
import { MODELS } from '.';
import type { ExportedSchemas } from '../../types';
import { Renderer } from '../renderer';
import { DiscriminatedUnionModel } from './discriminated-union';

describe('DiscriminatedUnionModel', () => {
  const productSchema = z.object({
    type: z.literal('product'),
    name: z.string(),
    price: z.number(),
  });
  const categorySchema = z.object({
    type: z.literal('category'),
    title: z.string(),
  });
  const schemas: ExportedSchemas = {
    Product: productSchema,
    Category: categorySchema,
  };

  describe('renderBlock', () => {
    it('should list of types and discriminator', () => {
      expect(
        new DiscriminatedUnionModel().renderBlock(
          z.discriminatedUnion('type', [productSchema, categorySchema]),
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown(`
        _Union of the following possible types (discriminated by \`type\`):_
        
        - [Product](#product)
        - [Category](#category)
      `);
    });
  });

  describe('renderInline', () => {
    it('should list of types and discriminator', () => {
      expect(
        new DiscriminatedUnionModel().renderInline(
          z.discriminatedUnion('type', [productSchema, categorySchema]),
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown('[Product](#product) _or_ [Category](#category)');
    });
  });
});
