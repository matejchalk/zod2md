import { z } from 'zod/v4';
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
  name: z.string().optional(),
  path: z.string().optional(),
  parserOpts: z.unknown().optional(),
});

export const UserConfig = z
  .object({
    extends: z.string().or(z.array(z.string())).optional(),
    formatter: z.string().optional(),
    rules: RulesConfig.optional(),
    parserPreset: z
      .union([z.string(), ParserPreset, z.promise(ParserPreset)])
      .optional(),
    ignores: z
      .array(
        convertZodFunctionToSchema(
          z.function({ input: [z.string()], output: z.boolean() })
        )
      )
      .optional(),
    defaultIgnores: z.boolean().optional(),
    plugin: PluginRecords,
    helpUrl: z.string(),
    prompt: UserPromptConfig,
  })
  .and(z.record(z.string(), z.unknown()));
