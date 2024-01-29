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
                model: {
                  type: 'string',
                  description: 'Entry point',
                },
              },
              {
                kind: 'model',
                key: 'platform',
                required: false,
                model: {
                  type: 'enum',
                  values: ['browser', 'node'],
                  description: 'Target platform',
                },
              },
              {
                kind: 'model',
                key: 'format',
                required: false,
                model: {
                  type: 'array',
                  items: {
                    kind: 'model',
                    model: {
                      type: 'enum',
                      values: ['esm', 'cjs'],
                      description: 'Module format',
                    },
                  },
                  description: 'Module formats',
                },
              },
              {
                kind: 'model',
                key: 'dts',
                required: false,
                model: {
                  type: 'boolean',
                  description: 'Emit declaration files?',
                },
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
                model: {
                  type: 'string',
                  description: 'Entry point',
                },
              },
              {
                kind: 'ref',
                key: 'platform',
                required: false,
                ref: {
                  path: 'src/config.ts',
                  name: 'platformSchema',
                  description: 'Target platform',
                },
              },
              {
                kind: 'model',
                key: 'format',
                required: false,
                model: {
                  type: 'array',
                  items: {
                    kind: 'ref',
                    ref: {
                      path: 'src/config.ts',
                      name: 'formatSchema',
                      description: 'Module format',
                    },
                  },
                  description: 'Module formats',
                  default: ['esm'],
                },
              },
              {
                kind: 'model',
                key: 'dts',
                required: false,
                model: {
                  type: 'boolean',
                  description: 'Emit declaration files?',
                  default: false,
                },
              },
            ],
          },
          {
            path: 'src/config.ts',
            name: 'formatSchema',
            type: 'enum',
            values: ['esm', 'cjs'],
            description: 'Module format',
          },
          {
            path: 'src/config.ts',
            name: 'platformSchema',
            type: 'enum',
            values: ['browser', 'node'],
            description: 'Target platform',
          },
        ],
        { title: 'Config file reference' }
      )
    ).toMatchFileSnapshot('__snapshots__/multi-exports.md');
  });
});
