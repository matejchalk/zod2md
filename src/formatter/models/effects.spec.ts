import { z } from 'zod/v3';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { EffectsModel } from './effects';

describe('EffectsModel', () => {
  describe('renderBlock', () => {
    it('should render underlying schema', () => {
      expect(
        new EffectsModel().renderBlock(
          z
            .union([z.string(), z.array(z.string())])
            .transform(value => (Array.isArray(value) ? value : [value])),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Union of the following possible types:_

        - \`string\`
        - \`Array<string>\`
      `);
    });
  });

  describe('renderInline', () => {
    it('should render underlying schema', () => {
      expect(
        new EffectsModel().renderInline(
          z
            .union([z.string(), z.array(z.string())])
            .transform(value => (Array.isArray(value) ? value : [value])),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`string | Array<string>`');
    });
  });
});
