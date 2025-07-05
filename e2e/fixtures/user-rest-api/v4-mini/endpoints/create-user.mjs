import { z } from 'zod/v4-mini';
import { User } from '../models.mjs';

export const CreateUserParams = z.extend(User, {
  password: z.string().check(z.minLength(6)),
});

export const CreateUserResponse = User;
