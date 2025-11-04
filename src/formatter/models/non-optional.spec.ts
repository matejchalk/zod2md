import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { NonOptionalModel } from './non-optional';

describe('NonOptionalModel', () => {
  describe('renderBlock', () => {
    it('should remove optional', () => {
      expect(
        new NonOptionalModel().renderBlock(
          z.string().optional().nonoptional(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('_String._');
    });

    it('should change nothing if not optional', () => {
      expect(
        new NonOptionalModel().renderBlock(
          z.string().nonoptional(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('_String._');
    });
  });

  describe('renderInline', () => {
    it('should remove optional', () => {
      expect(
        new NonOptionalModel().renderInline(
          z.string().optional().nonoptional(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`string`');
    });

    it('should change nothing if not optional', () => {
      expect(
        new NonOptionalModel().renderInline(
          z.string().nullable().nonoptional(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`string` (_nullable_)');
    });
  });
});
