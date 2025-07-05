import { z } from 'zod/v4';

export const PromptName = z.enum([
  'header',
  'type',
  'scope',
  'subject',
  'body',
  'footer',
  'isBreaking',
  'breakingBody',
  'breaking',
  'isIssueAffected',
  'issuesBody',
  'issues',
]);

export const PromptMessages = z
  .object({
    skip: z.string(),
    max: z.string(),
    min: z.string(),
    emptyWarning: z.string(),
    upperLimitWarning: z.string(),
    lowerLimitWarning: z.string(),
  })
  .and(z.record(z.string(), z.string()));

export const PromptConfig = z.object({
  settings: z.object({
    scopeEnumSeparator: z.string(),
    enableMultipleScopes: z.boolean(),
  }),
  messages: PromptMessages,
  questions: z.record(
    PromptName,
    z.object({
      description: z.string().optional(),
      messages: z.record(z.string(), z.string()).optional(),
      enum: z
        .record(
          z.string(),
          z.object({
            description: z.string().optional(),
            title: z.string().optional(),
            emoji: z.string().optional(),
          })
        )
        .optional(),
    })
  ),
});

// Zod v4 drops deepPartial support: https://zod.dev/v4/changelog?id=drops-deeppartial
export const UserPromptConfig = PromptConfig.partial();
