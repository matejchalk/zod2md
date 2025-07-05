import { z } from 'zod/v4-mini';
import { convertZodFunctionToSchema } from './_internal';
import { UserPromptConfig } from './prompt';
import { Rule, RulesConfig } from './rules';

export const Plugin = z.record(
  z.string(),
  z.object({
    rules: z.record(z.string(), Rule),
  })
);

export const PluginRecords = z.record(z.string(), Plugin);

export const ParserPreset = z.object({
  name: z.optional(z.string()),
  path: z.optional(z.string()),
  parserOpts: z.optional(z.unknown()),
});

export const UserConfig = z.intersection(
  z.object({
    extends: z.optional(z.union([z.string(), z.array(z.string())])),
    formatter: z.optional(z.string()),
    rules: z.optional(RulesConfig),
    parserPreset: z.optional(
      z.union([z.string(), ParserPreset, z.promise(ParserPreset)])
    ),
    ignores: z.optional(
      z.array(
        convertZodFunctionToSchema(
          z.function({ input: [z.string()], output: z.boolean() })
        )
      )
    ),
    defaultIgnores: z.optional(z.boolean()),
    plugin: PluginRecords,
    helpUrl: z.string(),
    prompt: UserPromptConfig,
  }),
  z.record(z.string(), z.unknown())
);
