import { z } from 'zod';
import { MODELS } from '.';
import type { ExportedSchemas } from '../../types';
import { Renderer } from '../renderer';
import { RecordModel } from './record';

describe('RecordModel', () => {
  describe('renderBlock', () => {
    it('should render key and value schemas', () => {
      const productSchema = z.object({});
      const schemas: ExportedSchemas = { Product: productSchema };

      expect(
        new RecordModel().renderBlock(
          z.record(z.string(), z.array(productSchema)),
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown(`
        _Object with dynamic keys:_

        - _keys of type_ \`string\`
        - _values of type_ _Array of_ [Product](#product) _items_
      `);
    });
  });

  describe('renderInline', () => {
    it('should render exported value schema', () => {
      const productSchema = z.object({});
      const schemas: ExportedSchemas = { Product: productSchema };

      expect(
        new RecordModel().renderInline(
          z.record(z.string(), z.array(productSchema)),
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown(
        '_Object with dynamic keys of type_ `string` _and values of type_ _Array of_ [Product](#product) _items_'
      );
    });

    it('should render typescript code if possible', () => {
      expect(
        new RecordModel().renderInline(
          z.record(z.string(), z.number()),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`Record<string, number>`');
    });
  });
});
