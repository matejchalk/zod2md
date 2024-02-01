import { User } from '../models.mjs';

export const UpdateUserParams = z.object({ username: Username });

export const UpdateUserPayload = User.omit({ username: true });
