import { z } from 'zod/v3';

export const Username = z.string().regex(/^[a-z][a-z\d.]*$/);

export const User = z.object({
  username: Username,
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
