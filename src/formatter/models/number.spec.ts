import { z } from 'zod';
import { NumberModel } from './number';

describe('NumberModel', () => {
  describe('renderBlock', () => {
    it('should render one-word sentence if there are no validations', () => {
      expect(new NumberModel().renderBlock(z.number())).toEqualMarkdown(
        '_Number._'
      );
    });

    it('should include validations', () => {
      expect(
        new NumberModel().renderBlock(z.number().int().min(0).max(100))
      ).toEqualMarkdown(
        '_Number that is a safe integer (i.e. between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`), is greater than or equal to 0 and is less than or equal to 100._'
      );
    });
  });

  describe('inlineBlock', () => {
    it('should render typescript code if there are no validations', () => {
      expect(new NumberModel().renderInline(z.number())).toEqualMarkdown(
        '`number`'
      );
    });

    it('should include validations', () => {
      expect(
        new NumberModel().renderInline(z.number().gte(0).lt(1))
      ).toEqualMarkdown('`number` (_≥0, <1_)');
    });
  });
});
