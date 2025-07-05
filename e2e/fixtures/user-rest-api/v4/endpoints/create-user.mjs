import { z } from 'zod/v4';
import { User } from '../models.mjs';

export const CreateUserParams = z.object({
  ...User.shape,
  password: z.string().min(6),
});

export const CreateUserResponse = User;
