import { defineConfig } from 'tsup';

export default defineConfig({
  platform: 'node',
  dts: true,
  entry: ['src/index.ts', 'src/bin.ts'],
  format: ['cjs', 'esm'],
  splitting: false,
});
