import { stat } from 'fs/promises';

export async function findDefaultConfig(): Promise<string | undefined> {
  const name = 'zod2md.config';
  const extensions = ['ts', 'mjs', 'js'];

  for (const ext of extensions) {
    const path = `${name}.${ext}`;
    if (await fileExists(path)) {
      return path;
    }
  }

  return undefined;
}

function fileExists(path: string): Promise<boolean> {
  return stat(path)
    .then(stats => stats.isFile())
    .catch(() => false);
}
