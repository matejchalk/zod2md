import { z } from 'zod';
import { Username } from '../models.mjs';

export const DeleteUserParams = z.object({ username: Username });
