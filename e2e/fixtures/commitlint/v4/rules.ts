import { z } from 'zod/v4';
import { convertZodFunctionToSchema } from './_internal';
import { Commit } from './parse';

export const RuleConfigSeverity = z.enum({
  Disabled: 0,
  Warning: 1,
  Error: 2,
} as const);

export const RuleConfigCondition = z.enum(['always', 'never']);

export const RuleConfigTuple = z
  .union([
    z.tuple([z.literal(RuleConfigSeverity.enum.Disabled)]),
    z.tuple([RuleConfigSeverity, RuleConfigCondition]),
    z.tuple([RuleConfigSeverity, RuleConfigCondition, z.unknown()]),
  ])
  .readonly();

export const RulesConfig = z.record(z.string(), RuleConfigTuple);

export const RuleOutcome = z
  .tuple([z.boolean(), z.string().optional()])
  .readonly();

// Zod v4 drops function schema support: https://zod.dev/v4/changelog?id=zfunction
export const Rule = convertZodFunctionToSchema(
  z.function({
    input: [Commit, RuleConfigCondition.optional(), z.never().optional()],
    output: z.union([RuleOutcome, z.promise(RuleOutcome)]),
  })
);
