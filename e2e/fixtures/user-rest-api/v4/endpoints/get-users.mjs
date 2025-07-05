import { z } from 'zod/v4';
import { User } from '../models.mjs';

export const GetUsersParams = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(0).max(100).default(30),
});

export const GetUsersResponse = z.object({
  users: z.array(User),
});
