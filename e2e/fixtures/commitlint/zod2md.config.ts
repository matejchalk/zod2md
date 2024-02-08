import type { Config } from 'zod2md';

export default {
  title: 'Commitlint config',
  entry: 'index.ts',
  output: '../../../tmp/config/commitlint.md',
} satisfies Config;
