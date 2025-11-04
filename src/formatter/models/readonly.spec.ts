import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { ReadonlyModel } from './readonly';

describe('ReadonlyModel', () => {
  describe('renderBlock', () => {
    it('should append paragraph to wrapped type', () => {
      expect(
        new ReadonlyModel().renderBlock(
          z.enum(['male', 'female', 'other']).readonly(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Enum, one of the following possible values:_

        - \`'male'\`
        - \`'female'\`
        - \`'other'\`

        _Readonly._
      `);
    });
  });

  describe('renderInline', () => {
    it('should append brackets to wrapped type', () => {
      expect(
        new ReadonlyModel().renderInline(
          z.string().readonly(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`string` (_readonly_)');
    });
  });
});
