import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { CatchModel } from './catch';

describe('CatchModel', () => {
  const permissiveUrlSchema = z.url().catch(ctx => {
    if (
      ctx.issues.length === 1 &&
      ctx.issues[0]?.code === 'invalid_format' &&
      ctx.issues[0]?.format === 'url'
    ) {
      return '';
    }
    throw ctx.issues;
  });

  describe('renderBlock', () => {
    it('should render underlying schema', () => {
      expect(
        new CatchModel().renderBlock(
          permissiveUrlSchema,
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('_String that is a valid URL._');
    });
  });

  describe('renderInline', () => {
    it('should render underlying schema', () => {
      expect(
        new CatchModel().renderInline(
          permissiveUrlSchema,
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`string` (_url_)');
    });
  });
});
