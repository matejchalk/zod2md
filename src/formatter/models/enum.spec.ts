import { z } from 'zod';
import { EnumModel } from './enum';

describe('EnumModel', () => {
  const alphabet = Array.from({ length: 26 }).map((_, i) =>
    String.fromCharCode('A'.charCodeAt(0) + i)
  );

  describe('renderBlock', () => {
    it('should render list of values', () => {
      expect(
        new EnumModel().renderBlock(z.enum(['pending', 'success', 'failure']))
      ).toEqualMarkdown(`
        _Enum, one of the following possible values:_

        - \`'pending'\`
        - \`'success'\`
        - \`'failure'\`
      `);
    });

    it('should collapse large list of values', () => {
      expect(new EnumModel().renderBlock(z.enum(alphabet))).toEqualMarkdown(`
        _Enum, one of the following possible values:_

        <details>
        <summary><i>Expand for full list of 26 values</i></summary>

        - \`'A'\`
        - \`'B'\`
        - \`'C'\`
        - \`'D'\`
        - \`'E'\`
        - \`'F'\`
        - \`'G'\`
        - \`'H'\`
        - \`'I'\`
        - \`'J'\`
        - \`'K'\`
        - \`'L'\`
        - \`'M'\`
        - \`'N'\`
        - \`'O'\`
        - \`'P'\`
        - \`'Q'\`
        - \`'R'\`
        - \`'S'\`
        - \`'T'\`
        - \`'U'\`
        - \`'V'\`
        - \`'W'\`
        - \`'X'\`
        - \`'Y'\`
        - \`'Z'\`

        </details>
      `);
    });
  });

  describe('renderInline', () => {
    it('should render typescript union of values', () => {
      expect(
        new EnumModel().renderInline(z.enum(['pending', 'success', 'failure']))
      ).toEqualMarkdown("`'pending' | 'success' | 'failure'`");
    });

    it('should truncate large list', () => {
      expect(new EnumModel().renderInline(z.enum(alphabet))).toEqualMarkdown(
        "`'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | ...`"
      );
    });
  });
});
