import { z } from 'zod/v4-mini';

export const CommitNote = z.object({
  title: z.string(),
  text: z.string(),
});

export const CommitReference = z.object({
  raw: z.string(),
  prefix: z.string(),
  action: z.nullable(z.string()),
  owner: z.nullable(z.string()),
  repository: z.nullable(z.string()),
  issue: z.nullable(z.string()),
});

export const Commit = z.object({
  raw: z.string(),
  header: z.string(),
  type: z.nullable(z.string()),
  scope: z.nullable(z.string()),
  subject: z.nullable(z.string()),
  body: z.nullable(z.string()),
  footer: z.nullable(z.string()),
  mentions: z.array(z.string()),
  notes: z.array(CommitNote),
  references: z.array(CommitReference),
  revert: z.any(),
  merge: z.any(),
});
