import { z } from 'zod';
import { MODELS } from '.';
import type { ExportedSchemas } from '../../types';
import { Renderer } from '../renderer';
import { PromiseModel } from './promise';

describe('PromiseModel', () => {
  describe('renderBlock', () => {
    it('should render inner type', () => {
      expect(
        new PromiseModel().renderBlock(
          z.promise(z.url()),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(
        '_Promise, resolves to value of type:_ `string` (_url_)'
      );
    });
  });

  describe('renderInline', () => {
    it('should render named inner type', () => {
      const userSchema = z.object({});
      const schemas: ExportedSchemas = { User: userSchema };
      expect(
        new PromiseModel().renderInline(
          z.promise(userSchema),
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown('_Promise of:_ [User](#user)');
    });

    it('should render typescript code if possible', () => {
      expect(
        new PromiseModel().renderInline(
          z.promise(z.union([z.string(), z.null()])),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`Promise<string | null>`');
    });
  });
});
