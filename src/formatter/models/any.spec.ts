import { AnyModel } from './any';

describe('AnyModel', () => {
  describe('renderBlock', () => {
    it('should render short sentence', () => {
      expect(new AnyModel().renderBlock()).toEqualMarkdown('_Any type._');
    });
  });

  describe('renderInline', () => {
    it('should render typescript code', () => {
      expect(new AnyModel().renderInline()).toEqualMarkdown('`any`');
    });
  });
});
