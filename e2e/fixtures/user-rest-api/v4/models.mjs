import { z } from 'zod/v4';

export const Username = z.string().regex(/^[a-z][a-z0-9.]*$/);

export const User = z.object({
  username: Username,
  email: z.email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
