import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4';
import { BooleanModel } from './boolean';

describe('BooleanModel', () => {
  describe('isSchema', () => {
    it('should recognize Zod v4 type', () => {
      expect(new BooleanModel().isSchema(z4.boolean())).toBe(true);
    });

    it('should recognize Zod v3 type', () => {
      expect(new BooleanModel().isSchema(z3.boolean())).toBe(true);
    });

    it('should NOT recognize Zod other type', () => {
      expect(new BooleanModel().isSchema(z4.string())).toBe(false);
    });

    it('should NOT recognize Zod wrapped type', () => {
      expect(new BooleanModel().isSchema(z4.boolean().optional())).toBe(false);
    });
  });

  describe('renderBlock', () => {
    it('should render one-word sentence', () => {
      expect(new BooleanModel().renderBlock()).toEqualMarkdown('_Boolean._');
    });
  });

  describe('renderInline', () => {
    it('should render typescript code', () => {
      expect(new BooleanModel().renderInline()).toEqualMarkdown('`boolean`');
    });
  });
});
