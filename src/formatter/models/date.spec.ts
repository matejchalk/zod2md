import { DateModel } from './date';

describe('DateModel', () => {
  describe('renderBlock', () => {
    it('should render one-word sentence', () => {
      expect(new DateModel().renderBlock()).toEqualMarkdown('_Date._');
    });
  });

  describe('renderInline', () => {
    it('should render typescript code', () => {
      expect(new DateModel().renderInline()).toEqualMarkdown('`Date`');
    });
  });
});
