import { UnknownModel } from './unknown';

describe('UnknownModel', () => {
  describe('renderBlock', () => {
    it('should render short sentence', () => {
      expect(new UnknownModel().renderBlock()).toEqualMarkdown(
        '_Unknown type._'
      );
    });
  });

  describe('renderInline', () => {
    it('should render typescript code', () => {
      expect(new UnknownModel().renderInline()).toEqualMarkdown('`unknown`');
    });
  });
});
