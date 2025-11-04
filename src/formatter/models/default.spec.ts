import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { DefaultModel } from './default';

describe('DefaultModel', () => {
  describe('renderBlock', () => {
    it('should append paragraph with default value', () => {
      expect(
        new DefaultModel().renderBlock(
          z.number().default(0),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Number._

        _Default value is_ \`0\`.
      `);
    });
  });

  describe('renderInline', () => {
    it('should append default value in brackets', () => {
      expect(
        new DefaultModel().renderInline(
          z.number().default(0),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`number` (_default:_ `0`)');
    });
  });
});
