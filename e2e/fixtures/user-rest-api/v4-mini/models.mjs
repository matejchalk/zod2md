import { z } from 'zod/v4-mini';

export const Username = z.string().check(z.regex(/^[a-z][a-z0-9.]*$/));

export const User = z.object({
  username: Username,
  email: z.email(),
  firstName: z.optional(z.string()),
  lastName: z.optional(z.string()),
});
