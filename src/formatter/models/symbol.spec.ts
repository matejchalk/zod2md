import { SymbolModel } from './symbol';

describe('SymbolModel', () => {
  describe('renderBlock', () => {
    it('should render one-word sentence', () => {
      expect(new SymbolModel().renderBlock()).toEqualMarkdown('_Symbol._');
    });
  });

  describe('renderInline', () => {
    it('should render typescript code', () => {
      expect(new SymbolModel().renderInline()).toEqualMarkdown('`symbol`');
    });
  });
});
