import { z } from 'zod/v3';
import { User } from '../models.mjs';

export const CreateUserParams = User.merge(
  z.object({
    password: z.string().min(6),
  })
);

export const CreateUserResponse = User;
