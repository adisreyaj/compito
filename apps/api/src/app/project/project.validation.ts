import { array, object, string } from 'joi';

export const createProjectValidationSchema = object({
  name: string().required().min(3).max(64),
  description: string().required().min(3).max(200),
  members: array().items(string()).required(),
  slug: string().required(),
});

export const updateMembersValidationSchema = object({
  type: string().required().valid('modify', 'set'),
  set: array().items(string()).optional().allow(null),
  add: array().items(string()).optional().allow(null),
  remove: array().items(string()).optional().allow(null),
});

export const updateProjectValidationSchema = object({
  name: string().min(3).max(64).optional().allow(null),
  description: string().min(3).max(200).optional().allow(null),
  members: array().items(string()).optional().allow(null),
  slug: string().optional().allow(null),
});
