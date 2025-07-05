import { z } from 'zod/v4-mini';
import { User, Username } from '../models.mjs';

export const UpdateUserParams = z.object({ username: Username });

export const UpdateUserPayload = z.omit(User, { username: true });
