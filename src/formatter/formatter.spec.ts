import { z } from 'zod';
import { formatSchemasAsMarkdown } from './formatter';

describe('formatSchemasAsMarkdown', () => {
  it('should document schemas in markdown (Zod %s)', async () => {
    const path = 'src/schemas.ts';
    const inputConfigSchema = z.object({
      entry: z.string(),
      tsconfig: z.string().optional(),
    });
    const outputConfigSchema = z.object({
      directory: z.string().default('docs'),
      format: z.enum(['md', 'html']).default('md'),
      clear: z.boolean().default(false),
    });
    const configSchema = z.object({
      input: inputConfigSchema,
      output: outputConfigSchema.optional(),
    });

    await expect(
      formatSchemasAsMarkdown(
        {
          InputConfig: inputConfigSchema,
          OutputConfig: outputConfigSchema,
          Config: configSchema,
        },
        { title: 'Configuration API' }
      )
    ).toMatchFileSnapshot('__snapshots__/config.md');
  });
});
