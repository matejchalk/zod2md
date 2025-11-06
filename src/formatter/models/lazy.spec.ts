import { z } from 'zod';
import { MODELS } from '.';
import type { ExportedSchemas } from '../../types';
import { Renderer } from '../renderer';
import { LazyModel } from './lazy';

describe('LazyModel', () => {
  const baseCategorySchema = z.object({
    name: z.string(),
  });
  type Category = z.infer<typeof baseCategorySchema> & {
    subcategories: Category[];
  };
  const subcategoriesSchema = z.lazy(() => categorySchema.array());
  const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
    subcategories: subcategoriesSchema,
  });

  const schemas: ExportedSchemas = {
    Category: categorySchema,
  };

  describe('renderBlock', () => {
    it('should render underlying schema', () => {
      expect(
        new LazyModel().renderBlock(
          subcategoriesSchema,
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown('_Array of [Category](#category) items._');
    });
  });

  describe('renderInline', () => {
    it('should render underlying schema', () => {
      expect(
        new LazyModel().renderInline(
          subcategoriesSchema,
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown('_Array of_ [Category](#category) _items_');
    });
  });
});
