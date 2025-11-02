import { z } from 'zod';
import { StringModel } from './string';

describe('StringModel', () => {
  describe('isSchema', () => {
    it('should recognize string type', () => {
      expect(new StringModel().isSchema(z.string())).toBe(true);
    });

    it('should recognize string sub-type', () => {
      expect(new StringModel().isSchema(z.url())).toBe(true);
    });

    it('should NOT recognize other type', () => {
      expect(new StringModel().isSchema(z.date())).toBe(false);
    });
  });

  describe('renderBlock', () => {
    it('should render one-word sentence if there are no validations', () => {
      expect(new StringModel().renderBlock(z.string())).toEqualMarkdown(
        '_String._'
      );
    });

    it('should include validations from string checks', () => {
      expect(
        new StringModel().renderBlock(z.string().min(1).max(280))
      ).toEqualMarkdown(
        '_String that has a minimum length of 1 and has a maximum length of 280._'
      );
    });

    it('should include validations from string sub-types', () => {
      expect(new StringModel().renderBlock(z.iso.datetime())).toEqualMarkdown(
        '_String that is a date and time in ISO 8601 format (any timezone offset)._'
      );
    });
  });

  describe('inlineBlock', () => {
    it('should render typescript code if there are no validations', () => {
      expect(new StringModel().renderInline(z.string())).toEqualMarkdown(
        '`string`'
      );
    });

    it('should include validations from string checks', () => {
      expect(
        new StringModel().renderInline(z.string().regex(/^[a-z0-9_]+$/))
      ).toEqualMarkdown('`string` (_regex: `/^[a-z0-9_]+$/`_)');
    });

    it('should include validations from string sub-types', () => {
      expect(new StringModel().renderInline(z.email())).toEqualMarkdown(
        '`string` (_email_)'
      );
    });
  });
});
