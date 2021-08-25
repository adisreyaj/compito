import { object, string } from 'joi';

export const createInviteValidationSchema = object({
  email: string().required().email(),
  role: string().required(),
});
