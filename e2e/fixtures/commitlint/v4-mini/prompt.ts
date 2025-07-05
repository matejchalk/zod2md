import { z } from 'zod/v4-mini';

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

export const PromptMessages = z.intersection(
  z.object({
    skip: z.string(),
    max: z.string(),
    min: z.string(),
    emptyWarning: z.string(),
    upperLimitWarning: z.string(),
    lowerLimitWarning: z.string(),
  }),
  z.record(z.string(), z.string())
);

export const PromptConfig = z.object({
  settings: z.object({
    scopeEnumSeparator: z.string(),
    enableMultipleScopes: z.boolean(),
  }),
  messages: PromptMessages,
  questions: z.record(
    PromptName,
    z.object({
      description: z.optional(z.string()),
      messages: z.optional(z.record(z.string(), z.string())),
      enum: z.optional(
        z.record(
          z.string(),
          z.object({
            description: z.optional(z.string()),
            title: z.optional(z.string()),
            emoji: z.optional(z.string()),
          })
        )
      ),
    })
  ),
});

// Zod v4 drops deepPartial support: https://zod.dev/v4/changelog?id=drops-deeppartial
export const UserPromptConfig = z.partial(PromptConfig);
