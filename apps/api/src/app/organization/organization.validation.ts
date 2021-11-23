import * as Joi from 'joi';

export const createOrgValidationSchema = Joi.object({
  name: Joi.string().required().min(2).max(64),
  slug: Joi.string().optional(),
  members: Joi.array().optional(),
});

export const updateOrgValidationSchema = Joi.object({
  name: Joi.string().min(2).max(64).optional().allow(null),
  slug: Joi.string().optional(),
  members: Joi.array().optional(),
});

export const updateMembersValidationSchema = Joi.object({
  type: Joi.string().required().valid('modify', 'set'),
  set: Joi.array().items(Joi.string()).optional().allow(null),
  add: Joi.array().items(Joi.string()).optional().allow(null),
  remove: Joi.array().items(Joi.string()).optional().allow(null),
});
