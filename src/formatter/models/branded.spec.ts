import { z } from 'zod/v3';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { BrandedModel } from './branded';

describe('BrandedModel', () => {
  describe('renderBlock', () => {
    it('should render underlying schema', () => {
      expect(
        new BrandedModel().renderBlock(
          z.string().brand<'User'>(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('_String._');
    });
  });

  describe('renderInline', () => {
    it('should render underlying schema', () => {
      expect(
        new BrandedModel().renderInline(
          z.string().brand<'User'>(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`string`');
    });
  });
});
