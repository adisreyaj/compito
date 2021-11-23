import * as Joi from 'joi';

export const createBoardValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(64),
  description: Joi.string().required().min(3).max(200),
  lists: Joi.array()
    .items({
      id: Joi.string(),
      name: Joi.string(),
    })
    .required(),
  projectId: Joi.string().required(),
});

export const updateBoardValidationSchema = Joi.object({
  name: Joi.string().min(3).max(64).optional().allow(null),
  description: Joi.string().min(3).max(200).optional().allow(null),
  lists: Joi.array()
    .items({
      id: Joi.string().required(),
      name: Joi.string().required(),
    })
    .optional()
    .allow(null),
});
