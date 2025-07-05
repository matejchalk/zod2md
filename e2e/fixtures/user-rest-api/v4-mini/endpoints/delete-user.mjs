import { z } from 'zod/v4-mini';
import { Username } from '../models.mjs';

export const DeleteUserParams = z.object({ username: Username });
