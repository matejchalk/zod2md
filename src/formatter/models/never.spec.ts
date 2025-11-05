import { NeverModel } from './never';

describe('NeverModel', () => {
  describe('renderBlock', () => {
    it('should render short sentence', () => {
      expect(new NeverModel().renderBlock()).toEqualMarkdown('_Never type._');
    });
  });

  describe('renderInline', () => {
    it('should render typescript code', () => {
      expect(new NeverModel().renderInline()).toEqualMarkdown('`never`');
    });
  });
});
