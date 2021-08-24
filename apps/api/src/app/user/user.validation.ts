import { object, string } from 'joi';

export const userNameValidation = object({
  firstName: string().required().min(1).max(200),
  lastName: string().required().min(1).max(200),
});

export const userSignupValidationSchema = object({
  email: string().email().required().min(5).max(200),
  password: string().required().min(6).max(32),
  org: string().required().min(3).max(64),
}).concat(userNameValidation);

export const roleUpdateValidationSchema = object({
  roleId: string().required(),
});

export const userUpdateValidationSchema = object({
  image: string(),
  firstName: string().min(1).max(200).optional(),
  lastName: string().min(1).max(200).optional(),
  password: string().min(6).max(32),
  newPassword: string().min(6).max(32),
}).with('password', 'newPassword');
