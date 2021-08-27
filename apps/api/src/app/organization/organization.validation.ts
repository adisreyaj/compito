import { array, object, string } from 'joi';

export const createOrgValidationSchema = object({
  name: string().required().min(2).max(64),
  slug: string().optional(),
  members: array().optional(),
});

export const updateOrgValidationSchema = object({
  name: string().min(2).max(64).optional().allow(null),
  slug: string().optional(),
  members: array().optional(),
});

export const updateMembersValidationSchema = object({
  type: string().required().valid('modify', 'set'),
  set: array().items(string()).optional().allow(null),
  add: array().items(string()).optional().allow(null),
  remove: array().items(string()).optional().allow(null),
});
