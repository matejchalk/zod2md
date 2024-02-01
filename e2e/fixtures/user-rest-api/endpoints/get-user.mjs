import { z } from 'zod';
import { User, Username } from '../models.mjs';

export const GetUserParams = z.object({ username: Username });

export const GetUserResponse = User;
