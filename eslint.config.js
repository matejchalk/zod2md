import node from '@code-pushup/eslint-config/node.js';
import typescript from '@code-pushup/eslint-config/typescript.js';
import vitest from '@code-pushup/eslint-config/vitest.js';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  ...typescript,
  ...node,
  ...vitest,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/class-methods-use-this': 'off',
    },
  },
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: 'tsconfig.json',
        },
      },
    },
  },
  {
    ignores: ['dist/**/*', 'coverage/**/*', 'tmp/**/*'],
  },
);
