import { z } from 'zod';
import { User, Username } from '../models.mjs';

export const UpdateUserParams = z.object({ username: Username });

export const UpdateUserPayload = User.omit({ username: true });
