import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { PipeModel } from './pipe';

describe('PipeModel', () => {
  const postalCodeSchema = z
    .string()
    .transform(postalCode => postalCode.toUpperCase().replaceAll(' ', ''))
    .pipe(z.string().regex(/^\d{4}(?:[A-Z]{2}|\d)?$/, 'Invalid postal code'));

  const capitalizeSchema = z
    .string()
    .transform(x => `${x[0]?.toUpperCase() ?? ''}${x.substring(1)}`);

  describe('renderBlock', () => {
    it('should render piped output schema', () => {
      expect(
        new PipeModel().renderBlock(postalCodeSchema, new Renderer(MODELS, {}))
      ).toEqualMarkdown(
        '_String that matches the regular expression `/^\\d{4}(?:[A-Z]{2}|\\d)?$/`._'
      );
    });

    it('should render input schema in case of transform', () => {
      expect(
        new PipeModel().renderBlock(capitalizeSchema, new Renderer(MODELS, {}))
      ).toEqualMarkdown('_String._');
    });
  });

  describe('renderInline', () => {
    it('should render piped output schema', () => {
      expect(
        new PipeModel().renderInline(postalCodeSchema, new Renderer(MODELS, {}))
      ).toEqualMarkdown('`string` (_regex: `/^\\d{4}(?:[A-Z]{2}|\\d)?$/`_)');
    });

    it('should render input schema in case of transform', () => {
      expect(
        new PipeModel().renderInline(capitalizeSchema, new Renderer(MODELS, {}))
      ).toEqualMarkdown('`string`');
    });
  });
});
