import * as Joi from 'joi';

export const createInviteValidationSchema = Joi.object({
  email: Joi.string().required().email(),
  role: Joi.string().required(),
});
