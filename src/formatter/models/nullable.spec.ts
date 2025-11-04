import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { NullableModel } from './nullable';

describe('NullableModel', () => {
  describe('renderBlock', () => {
    it('should append paragraph to wrapped type', () => {
      expect(
        new NullableModel().renderBlock(
          z.enum(['male', 'female', 'other']).nullable(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Enum, one of the following possible values:_

        - \`'male'\`
        - \`'female'\`
        - \`'other'\`

        _Nullable._
      `);
    });
  });

  describe('renderInline', () => {
    it('should append brackets to wrapped type', () => {
      expect(
        new NullableModel().renderInline(
          z.string().nullable(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`string` (_nullable_)');
    });
  });
});
