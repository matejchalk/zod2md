import { z } from 'zod';
import { BigIntModel } from './bigint';

describe('BigIntModel', () => {
  describe('renderBlock', () => {
    it('should render one-word sentence if there are no validations', () => {
      expect(new BigIntModel().renderBlock(z.bigint())).toEqualMarkdown(
        '_BigInt._'
      );
    });

    it('should include validations', () => {
      expect(
        new BigIntModel().renderBlock(z.bigint().positive())
      ).toEqualMarkdown('_BigInt that is greater than 0._');
    });
  });

  describe('inlineBlock', () => {
    it('should render typescript code if there are no validations', () => {
      expect(new BigIntModel().renderInline(z.bigint())).toEqualMarkdown(
        '`bigint`'
      );
    });

    it('should include validations', () => {
      expect(
        new BigIntModel().renderInline(z.bigint().multipleOf(2n))
      ).toEqualMarkdown('`bigint` (_even_)');
    });
  });
});
