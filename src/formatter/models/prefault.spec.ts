import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { PrefaultModel } from './prefault';

describe('PrefaultModel', () => {
  describe('renderBlock', () => {
    it('should append paragraph with prefault value', () => {
      expect(
        new PrefaultModel().renderBlock(
          z.string().toUpperCase().prefault('dev'),
          new Renderer(MODELS, {}),
        ),
      ).toEqualMarkdown(`
        _String._

        _Pre-parse default value is_ \`'dev'\`.
      `);
    });
  });

  describe('renderInline', () => {
    it('should append prefault value in brackets', () => {
      expect(
        new PrefaultModel().renderInline(
          z.string().toUpperCase().prefault('dev'),
          new Renderer(MODELS, {}),
        ),
      ).toEqualMarkdown("`string` (_prefault:_ `'dev'`)");
    });
  });
});
