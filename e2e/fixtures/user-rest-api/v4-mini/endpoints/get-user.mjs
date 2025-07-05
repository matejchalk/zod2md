import { z } from 'zod/v4-mini';
import { User, Username } from '../models.mjs';

export const GetUserParams = z.object({ username: Username });

export const GetUserResponse = User;
