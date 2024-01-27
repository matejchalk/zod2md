import { z } from 'zod';
import { findZodSchemas } from './find-schemas';
import type { ExportedSchema } from './types';

describe('find Zod schemas in modules', () => {
  const userSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    avatar: z.string().url().optional(),
  });
  const orgSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  it('should find named exports', () => {
    expect(
      findZodSchemas({
        'src/schemas.ts': {
          userSchema,
          orgSchema,
          //   DEFAULT_AVATAR: 'https://example.com/anonymous.png',
        },
      })
    ).toEqual<ExportedSchema[]>([
      { name: 'userSchema', schema: userSchema, path: 'src/schemas.ts' },
      { name: 'orgSchema', schema: orgSchema, path: 'src/schemas.ts' },
    ]);
  });

  it('should find default exports (ESM)', () => {
    expect(
      findZodSchemas({
        'src/schemas/user.ts': {
          default: userSchema,
        },
        'src/schemas/org.ts': {
          default: orgSchema,
        },
      })
    ).toEqual<ExportedSchema[]>([
      { schema: userSchema, path: 'src/schemas/user.ts' },
      { schema: orgSchema, path: 'src/schemas/org.ts' },
    ]);
  });

  it('should find default exports (CJS)', () => {
    expect(
      findZodSchemas({
        'src/schemas/user.ts': userSchema,
        'src/schemas/org.ts': orgSchema,
      })
    ).toEqual<ExportedSchema[]>([
      { schema: userSchema, path: 'src/schemas/user.ts' },
      { schema: orgSchema, path: 'src/schemas/org.ts' },
    ]);
  });

  it('should find default and named exports (ESM)', () => {
    expect(
      findZodSchemas({
        'src/schemas/user.ts': {
          default: userSchema,
          orgSchema,
        },
      })
    ).toEqual<ExportedSchema[]>([
      { schema: userSchema, path: 'src/schemas/user.ts' },
      { name: 'orgSchema', schema: orgSchema, path: 'src/schemas/user.ts' },
    ]);
  });

  it('should filter out non-Zod exports', () => {
    expect(
      findZodSchemas({
        'src/user.ts': {
          User: userSchema,
          MIN_PASSWORD_LENGTH: 6,
          checkPassword: (str: string) => str.length >= 6,
        },
      })
    ).toEqual<ExportedSchema[]>([
      { name: 'User', schema: userSchema, path: 'src/user.ts' },
    ]);
  });
});
