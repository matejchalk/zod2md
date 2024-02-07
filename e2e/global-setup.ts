import { mkdir } from 'fs/promises';
import { build, type Options } from 'tsup';
import tsupConfig from '../tsup.config';

export async function setup() {
  await mkdir('tmp', { recursive: true });
  await build(tsupConfig as Options);
}
