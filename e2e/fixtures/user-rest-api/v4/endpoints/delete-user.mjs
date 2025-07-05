import { z } from 'zod/v4';
import { Username } from '../models.mjs';

export const DeleteUserParams = z.object({ username: Username });
