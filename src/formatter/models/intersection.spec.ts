import { z } from 'zod';
import { MODELS } from '.';
import { Renderer } from '../renderer';
import { IntersectionModel } from './intersection';

describe('IntersectionModel', () => {
  describe('renderBlock', () => {
    it('should render list of types', () => {
      expect(
        new IntersectionModel().renderBlock(
          z.intersection(
            z.uuid(),
            z.object({ __brand__: z.literal('User').optional() })
          ),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown(`
        _Intersection of the following possible types:_
        
        - \`string\` (_uuid_)
        - _Object with properties:_
          - \`__brand__\`: \`'User'\`
      `);
    });

    it('should render links to type', () => {
      const idSchema = z.uuid();
      const userIdSchema = z.intersection(
        idSchema,
        z.object({ __brand__: z.literal('User').optional() })
      );
      const schemas = { ID: idSchema, UserID: userIdSchema };
      expect(
        new IntersectionModel().renderBlock(
          userIdSchema,
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown(`
        _Intersection of the following possible types:_
        
        - [ID](#id)
        - _Object with properties:_
          - \`__brand__\`: \`'User'\`
      `);
    });
  });

  describe('renderInline', () => {
    it('should render sentence with list of options', () => {
      const basicOptionsSchema = z.object({});
      const advancedOptionsSchema = z.object({});
      const optionsSchema = z.intersection(
        basicOptionsSchema,
        advancedOptionsSchema
      );
      const schemas = {
        BasicOptions: basicOptionsSchema,
        AdvancedOptions: advancedOptionsSchema,
        Options: optionsSchema,
      };
      expect(
        new IntersectionModel().renderInline(
          optionsSchema,
          new Renderer(MODELS, schemas)
        )
      ).toEqualMarkdown(
        '[BasicOptions](#basicoptions) _and_ [AdvancedOptions](#advancedoptions)'
      );
    });

    it('should render typescript intersection type for primtive options', () => {
      expect(
        new IntersectionModel().renderInline(
          z.intersection(z.string(), z.number()),
          new Renderer(MODELS, {})
        )
      ).toEqualMarkdown('`string & number`');
    });
  });
});
