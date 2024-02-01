import { z } from 'zod';
import { User } from '../models.mjs';

export const CreateUserParams = User.merge(
  z.object({
    password: z.string().min(6),
  })
);

export const CreateUserResponse = User;
