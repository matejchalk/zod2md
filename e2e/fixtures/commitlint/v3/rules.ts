import { z } from 'zod/v3';
import { Commit } from './parse';

export const RuleConfigSeverity = z.nativeEnum({
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

export const RulesConfig = z.record(RuleConfigTuple);

export const RuleOutcome = z
  .tuple([z.boolean(), z.string().optional()])
  .readonly();

export const Rule = z
  .function()
  .args(Commit, RuleConfigCondition.optional(), z.never().optional())
  .returns(z.union([RuleOutcome, z.promise(RuleOutcome)]));
