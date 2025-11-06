import { NullModel } from './null';

describe('NullModel', () => {
  describe('renderBlock', () => {
    it('should render short sentence', () => {
      expect(new NullModel().renderBlock()).toEqualMarkdown('_Null._');
    });
  });

  describe('renderInline', () => {
    it('should render typescript code', () => {
      expect(new NullModel().renderInline()).toEqualMarkdown('`null`');
    });
  });
});
