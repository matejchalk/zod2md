import { UndefinedModel } from './undefined';

describe('UndefinedModel', () => {
  describe('renderBlock', () => {
    it('should render short sentence', () => {
      expect(new UndefinedModel().renderBlock()).toEqualMarkdown(
        '_Undefined._'
      );
    });
  });

  describe('renderInline', () => {
    it('should render typescript code', () => {
      expect(new UndefinedModel().renderInline()).toEqualMarkdown(
        '`undefined`'
      );
    });
  });
});
