import { z } from 'zod/v3';

export const CommitNote = z.object({
  title: z.string(),
  text: z.string(),
});

export const CommitReference = z.object({
  raw: z.string(),
  prefix: z.string(),
  action: z.string().nullable(),
  owner: z.string().nullable(),
  repository: z.string().nullable(),
  issue: z.string().nullable(),
});

export const Commit = z.object({
  raw: z.string(),
  header: z.string(),
  type: z.string().nullable(),
  scope: z.string().nullable(),
  subject: z.string().nullable(),
  body: z.string().nullable(),
  footer: z.string().nullable(),
  mentions: z.array(z.string()),
  notes: z.array(CommitNote),
  references: z.array(CommitReference),
  revert: z.any(),
  merge: z.any(),
});
