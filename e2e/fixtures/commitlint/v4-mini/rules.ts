import { z } from 'zod/v4-mini';
import { convertZodFunctionToSchema } from './_internal';
import { Commit } from './parse';

export const RuleConfigSeverity = z.enum({
  Disabled: 0,
  Warning: 1,
  Error: 2,
} as const);

export const RuleConfigCondition = z.enum(['always', 'never']);

export const RuleConfigTuple = z.readonly(
  z.union([
    z.tuple([z.literal(RuleConfigSeverity.def.entries.Disabled)]),
    z.tuple([RuleConfigSeverity, RuleConfigCondition]),
    z.tuple([RuleConfigSeverity, RuleConfigCondition, z.unknown()]),
  ])
);

export const RulesConfig = z.record(z.string(), RuleConfigTuple);

export const RuleOutcome = z.readonly(
  z.tuple([z.boolean(), z.optional(z.string())])
);

// Zod v4 drops function schema support: https://zod.dev/v4/changelog?id=zfunction
export const Rule = convertZodFunctionToSchema(
  z.function({
    input: [Commit, z.optional(RuleConfigCondition), z.optional(z.never())],
    output: z.union([RuleOutcome, z.promise(RuleOutcome)]),
  })
);
