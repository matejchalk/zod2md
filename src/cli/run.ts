import { writeFile } from 'fs/promises';
import type { Options } from '../types';
import { resolveConfig } from './resolve-config';

export async function runCLI(
  handler: (options: Options) => Promise<string>,
  argv?: string[]
) {
  const config = await resolveConfig(argv);

  const markdown = await handler(config);

  await writeFile(config.output, markdown);
  console.info(`🚀 Generated Markdown docs in ${config.output}`);
}
