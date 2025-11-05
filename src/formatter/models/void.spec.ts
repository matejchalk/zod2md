import { VoidModel } from './void';

describe('VoidModel', () => {
  describe('renderBlock', () => {
    it('should render short sentence', () => {
      expect(new VoidModel().renderBlock()).toEqualMarkdown('_Void type._');
    });
  });

  describe('renderInline', () => {
    it('should render typescript code', () => {
      expect(new VoidModel().renderInline()).toEqualMarkdown('`void`');
    });
  });
});
