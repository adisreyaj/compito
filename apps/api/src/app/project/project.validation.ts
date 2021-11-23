import * as Joi from 'joi';

export const createProjectValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(64),
  description: Joi.string().required().min(3).max(200),
  members: Joi.array().items(Joi.string()).required(),
  slug: Joi.string().required(),
});

export const updateMembersValidationSchema = Joi.object({
  type: Joi.string().required().valid('modify', 'set'),
  set: Joi.array().items(Joi.string()).optional().allow(null),
  add: Joi.array().items(Joi.string()).optional().allow(null),
  remove: Joi.array().items(Joi.string()).optional().allow(null),
});

export const updateProjectValidationSchema = Joi.object({
  name: Joi.string().min(3).max(64).optional().allow(null),
  description: Joi.string().min(3).max(200).optional().allow(null),
  members: Joi.array().items(Joi.string()).optional().allow(null),
  slug: Joi.string().optional().allow(null),
});
