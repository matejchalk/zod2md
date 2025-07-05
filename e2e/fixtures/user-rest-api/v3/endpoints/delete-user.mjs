import { z } from 'zod/v3';
import { Username } from '../models.mjs';

export const DeleteUserParams = z.object({ username: Username });
