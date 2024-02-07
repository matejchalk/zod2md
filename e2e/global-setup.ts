import { build, type Options } from 'tsup';
import tsupConfig from '../tsup.config';

export async function setup() {
  await build(tsupConfig as Options);
}
