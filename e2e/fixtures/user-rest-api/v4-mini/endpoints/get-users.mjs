import { z } from 'zod/v4-mini';
import { User } from '../models.mjs';

export const GetUsersParams = z.object({
  page: z._default(z.number().check(z.int(), z.minimum(1)), 1),
  pageSize: z._default(
    z.number().check(z.int(), z.minimum(0), z.maximum(100)),
    30
  ),
});

export const GetUsersResponse = z.object({
  users: z.array(User),
});
