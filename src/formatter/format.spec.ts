import { formatModelsAsMarkdown } from './format';

describe('format models from Zod as Markdown document', () => {
  it('should format single export', () => {
    expect(
      formatModelsAsMarkdown(
        [
          {
            path: 'src/config.ts',
            name: 'configSchema',
            type: 'object',
            fields: [
              {
                kind: 'model',
                key: 'entry',
                required: true,
                model: { type: 'string' },
              },
              {
                kind: 'model',
                key: 'platform',
                required: false,
                model: { type: 'enum', values: ['browser', 'node'] },
              },
              {
                kind: 'model',
                key: 'format',
                required: false,
                model: {
                  type: 'array',
                  items: {
                    kind: 'model',
                    model: { type: 'enum', values: ['esm', 'cjs'] },
                  },
                },
              },
              {
                kind: 'model',
                key: 'dts',
                required: false,
                model: { type: 'boolean' },
              },
            ],
          },
        ],
        { title: 'Config file reference' }
      )
    ).toMatchFileSnapshot('__snapshots__/single-export.md');
  });

  it('should format multiple exports', () => {
    expect(
      formatModelsAsMarkdown(
        [
          {
            path: 'src/config.ts',
            name: 'configSchema',
            type: 'object',
            fields: [
              {
                kind: 'model',
                key: 'entry',
                required: true,
                model: { type: 'string' },
              },
              {
                kind: 'ref',
                key: 'platform',
                required: false,
                ref: { path: 'src/config.ts', name: 'platformSchema' },
              },
              {
                kind: 'model',
                key: 'format',
                required: false,
                model: {
                  type: 'array',
                  items: {
                    kind: 'ref',
                    ref: { path: 'src/config.ts', name: 'formatSchema' },
                  },
                },
              },
              {
                kind: 'model',
                key: 'dts',
                required: false,
                model: { type: 'boolean' },
              },
            ],
          },
          {
            path: 'src/config.ts',
            name: 'formatSchema',
            type: 'enum',
            values: ['esm', 'cjs'],
          },
          {
            path: 'src/config.ts',
            name: 'platformSchema',
            type: 'enum',
            values: ['browser', 'node'],
          },
        ],
        { title: 'Config file reference' }
      )
    ).toMatchFileSnapshot('__snapshots__/multi-exports.md');
  });
});
