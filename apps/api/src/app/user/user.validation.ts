import * as Joi from 'joi';

export const userNameValidation = Joi.object({
  firstName: Joi.string().required().min(1).max(200),
  lastName: Joi.string().required().min(1).max(200),
});

export const userSignupValidationSchema = Joi.object({
  email: Joi.string().email().required().min(5).max(200),
  password: Joi.string().required().min(6).max(32),
  org: Joi.string().required().min(3).max(64),
}).concat(userNameValidation);

export const roleUpdateValidationSchema = Joi.object({
  roleId: Joi.string().required(),
});

export const userUpdateValidationSchema = Joi.object({
  image: Joi.string(),
  firstName: Joi.string().min(1).max(200).optional(),
  lastName: Joi.string().min(1).max(200).optional(),
  password: Joi.string().min(6).max(32),
  newPassword: Joi.string().min(6).max(32),
}).with('password', 'newPassword');
