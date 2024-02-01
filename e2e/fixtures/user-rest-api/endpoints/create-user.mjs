import { z } from 'zod';
import { User } from '../models.mjs';

export const CreateUserParams = User.merge({
  password: z.string().minLength(6),
});

export const CreateUserResponse = User;
