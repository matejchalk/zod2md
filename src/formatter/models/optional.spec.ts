import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { OptionalModel } from './optional';

describe('OptionalModel', () => {
  describe('renderBlock', () => {
    it('should append paragraph to wrapped type', () => {
      expect(
        new OptionalModel().renderBlock(
          z.enum(['male', 'female', 'other']).optional(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Enum, one of the following possible values:_

        - \`'male'\`
        - \`'female'\`
        - \`'other'\`

        _Optional._
      `);
    });
  });

  describe('renderInline', () => {
    it('should append brackets to wrapped type', () => {
      expect(
        new OptionalModel().renderInline(
          z.string().optional(),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`string` (_optional_)');
    });
  });
});
