import { z, ZodType } from 'zod';
import type { NamedModel } from '../types';
import { convertSchemas } from './convert-schemas';

describe('convert exported Zod schemas to models', () => {
  it('should convert object type with primitives', () => {
    expect(
      convertSchemas([
        {
          name: 'User',
          path: 'schemas.ts',
          schema: z.object({
            id: z.number().int().min(0),
            email: z.string().email(),
            displayName: z.string().optional(),
            avatarUrl: z.string().url().optional(),
            isAdmin: z.boolean().default(false),
            accountType: z.enum(['email-password', 'Google', 'GitHub']),
            lastSignedIn: z.date().optional(),
          }),
        },
      ])
    ).toEqual<NamedModel[]>([
      {
        type: 'object',
        fields: [
          {
            kind: 'model',
            key: 'id',
            required: true,
            model: { type: 'number', validations: ['safeint', ['gte', 0]] },
          },
          {
            kind: 'model',
            key: 'email',
            required: true,
            model: { type: 'string', validations: ['email'] },
          },
          {
            kind: 'model',
            key: 'displayName',
            required: false,
            model: { type: 'string' },
          },
          {
            kind: 'model',
            key: 'avatarUrl',
            required: false,
            model: { type: 'string', validations: ['url'] },
          },
          {
            kind: 'model',
            key: 'isAdmin',
            required: false,
            model: { type: 'boolean', default: false },
          },
          {
            kind: 'model',
            key: 'accountType',
            required: true,
            model: {
              type: 'enum',
              values: ['email-password', 'Google', 'GitHub'],
            },
          },
          {
            kind: 'model',
            key: 'lastSignedIn',
            required: false,
            model: { type: 'date' },
          },
        ],
        name: 'User',
        path: 'schemas.ts',
      },
    ]);
  });

  it('should reference other exported types and include descriptions', () => {
    const reviewSchema = z.object({
      text: z.string(),
      rating: z.number().min(0).max(5),
    });
    const authorSchema = z
      .object({
        name: z.string().describe('First and last name'),
        dateOfBirth: z.date().optional(),
      })
      .describe('Book author');
    const bookSchema = z.object({
      title: z.string(),
      author: authorSchema,
      reviews: z
        .array(reviewSchema)
        .optional()
        .describe('Reader reviews ordered from most recent'),
    });

    expect(
      convertSchemas([
        {
          name: 'Book',
          path: 'book.schema.ts',
          schema: bookSchema,
        },
        {
          name: 'Author',
          path: 'author.schema.ts',
          schema: authorSchema,
        },
        {
          name: 'Review',
          path: 'review.schema.ts',
          schema: reviewSchema,
        },
      ])
    ).toEqual<NamedModel[]>([
      {
        name: 'Book',
        path: 'book.schema.ts',
        type: 'object',
        fields: [
          {
            kind: 'model',
            key: 'title',
            required: true,
            model: { type: 'string' },
          },
          {
            kind: 'ref',
            key: 'author',
            required: true,
            ref: {
              name: 'Author',
              path: 'author.schema.ts',
              description: 'Book author',
            },
          },
          {
            kind: 'model',
            key: 'reviews',
            required: false,
            model: {
              type: 'array',
              items: {
                kind: 'ref',
                ref: {
                  name: 'Review',
                  path: 'review.schema.ts',
                },
              },
              description: 'Reader reviews ordered from most recent',
            },
          },
        ],
      },
      {
        name: 'Author',
        path: 'author.schema.ts',
        type: 'object',
        fields: [
          {
            kind: 'model',
            key: 'name',
            required: true,
            model: {
              type: 'string',
              description: 'First and last name',
            },
          },
          {
            kind: 'model',
            key: 'dateOfBirth',
            required: false,
            model: { type: 'date' },
          },
        ],
        description: 'Book author',
      },
      {
        name: 'Review',
        path: 'review.schema.ts',
        type: 'object',
        fields: [
          {
            kind: 'model',
            key: 'text',
            required: true,
            model: { type: 'string' },
          },
          {
            kind: 'model',
            key: 'rating',
            required: true,
            model: {
              type: 'number',
              validations: [
                ['gte', 0],
                ['lte', 5],
              ],
            },
          },
        ],
      },
    ]);
  });

  it('should warn if type unsupported and use never', () => {
    vi.spyOn(console, 'warn').mockReturnValue();

    expect(
      convertSchemas([
        { path: 'schemas.ts', name: 'ID', schema: z.string().brand('ID') },
        {
          path: 'schemas.ts',
          name: 'Experimental',
          schema: new ZodType({
            type: 'ZodExperimental' as z.core.$ZodTypeDef['type'],
          }),
        },
      ])
    ).toEqual<NamedModel[]>([
      {
        type: 'string',
        name: 'ID',
        path: 'schemas.ts',
      },
      {
        type: 'never',
        name: 'Experimental',
        path: 'schemas.ts',
      },
    ]);

    expect(console.warn).toHaveBeenCalledWith(
      `WARNING: Zod type ZodExperimental is not supported, using never.\nIf you'd like support for ZodExperimental to be added, please create an issue: https://github.com/matejchalk/zod2md/issues/new`
    );
  });

  it('should support the ZodPipeline type', () => {
    const PostalCodeSchema = z
      .string()
      .transform((postalCode: string) =>
        postalCode.toUpperCase().replaceAll(' ', '')
      )
      .pipe(z.string().regex(/^\d{4}(?:[A-Z]{2}|\d)?$/, 'Invalid postal code'));

    expect(
      convertSchemas([
        { path: 'postalcode.ts', schema: PostalCodeSchema, name: 'PostalCode' },
      ])
    ).toEqual<NamedModel[]>([
      {
        name: 'PostalCode',
        path: 'postalcode.ts',
        type: 'string',
        validations: [['regex', /^\d{4}(?:[A-Z]{2}|\d)?$/]],
      },
    ]);
  });

  it('should suppot the ZodDiscriminatedUnion type', () => {
    const schemaA = z
      .object({
        type: z.literal('first'),
        name: z.string(),
      })
      .describe('Schema A');
    const schemaB = z
      .object({
        type: z.literal('second'),
        age: z.number().min(21).max(90),
      })
      .describe('Schema B');
    const unionSchema = z.discriminatedUnion('type', [schemaA, schemaB]);

    expect(
      convertSchemas([
        { path: 'unionschema.ts', name: 'Union', schema: unionSchema },
      ])
    ).toEqual<NamedModel[]>([
      {
        name: 'Union',
        options: [
          {
            kind: 'model',
            model: {
              description: 'Schema A',
              fields: [
                {
                  key: 'type',
                  kind: 'model',
                  model: {
                    type: 'literal',
                    value: 'first',
                  },
                  required: true,
                },
                {
                  key: 'name',
                  kind: 'model',
                  model: {
                    type: 'string',
                  },
                  required: true,
                },
              ],
              type: 'object',
            },
          },
          {
            kind: 'model',
            model: {
              description: 'Schema B',
              fields: [
                {
                  key: 'type',
                  kind: 'model',
                  model: {
                    type: 'literal',
                    value: 'second',
                  },
                  required: true,
                },
                {
                  key: 'age',
                  kind: 'model',
                  model: {
                    type: 'number',
                    validations: [
                      ['gte', 21],
                      ['lte', 90],
                    ],
                  },
                  required: true,
                },
              ],
              type: 'object',
            },
          },
        ],
        path: 'unionschema.ts',
        type: 'union',
      },
    ]);
  });

  it('should support the ZodCatch type', () => {
    const permissiveUrlSchema = z
      .string()
      .url()
      .catch(ctx => {
        if (
          ctx.issues.length === 1 &&
          ctx.issues[0]?.code === 'invalid_format' &&
          ctx.issues[0]?.format === 'url'
        ) {
          return '';
        }
        throw ctx.issues;
      });

    expect(
      convertSchemas([
        {
          path: 'utils.ts',
          schema: permissiveUrlSchema,
          name: 'URL',
        },
      ])
    ).toEqual<NamedModel[]>([
      {
        name: 'URL',
        path: 'utils.ts',
        type: 'string',
        validations: ['url'],
      },
    ]);
  });

  it('should support the ZodLazy type', () => {
    const baseCategorySchema = z.object({
      name: z.string(),
    });
    type Category = z.infer<typeof baseCategorySchema> & {
      subcategories: Category[];
    };
    const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
      subcategories: z.lazy(() => categorySchema.array()),
    });

    expect(
      convertSchemas([
        {
          path: 'recursive.ts',
          schema: categorySchema,
          name: 'Category',
        },
      ])
    ).toEqual<NamedModel[]>([
      {
        name: 'Category',
        path: 'recursive.ts',
        type: 'object',
        fields: [
          {
            key: 'name',
            kind: 'model',
            model: { type: 'string' },
            required: true,
          },
          {
            key: 'subcategories',
            kind: 'model',
            model: {
              type: 'array',
              items: {
                kind: 'ref',
                ref: { path: 'recursive.ts', name: 'Category' },
              },
            },
            required: true,
          },
        ],
      },
    ]);
  });
});
