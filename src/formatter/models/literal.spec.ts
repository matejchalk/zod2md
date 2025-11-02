import { z } from 'zod';
import { LiteralModel } from './literal';

describe('LiteralModel', () => {
  describe('renderBlock', () => {
    it('should render single literal value', () => {
      expect(new LiteralModel().renderBlock(z.literal(false))).toEqualMarkdown(
        '_Literal `false` value._'
      );
    });

    it('should render multiple literal values', () => {
      expect(new LiteralModel().renderBlock(z.literal([200, 400, 404, 500])))
        .toEqualMarkdown(`
          _One of the following possible literal values:_

          - \`200\`
          - \`400\`
          - \`404\`
          - \`500\`
        `);
    });
  });

  describe('renderInline', () => {
    it('should render single literal value', () => {
      expect(new LiteralModel().renderInline(z.literal(false))).toEqualMarkdown(
        '`false`'
      );
    });

    it('should render multiple literal values', () => {
      expect(
        new LiteralModel().renderInline(z.literal([200, 400, 404, 500]))
      ).toEqualMarkdown('`200 | 400 | 404 | 500`');
    });
  });
});
