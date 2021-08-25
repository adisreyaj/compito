import { array, object, string } from 'joi';

export const createBoardValidationSchema = object({
  name: string().required().min(3).max(64),
  description: string().required().min(3).max(200),
  lists: array()
    .items({
      id: string(),
      name: string(),
    })
    .required(),
  projectId: string().required(),
});

export const updateBoardValidationSchema = object({
  name: string().min(3).max(64).optional().allow(null),
  description: string().min(3).max(200).optional().allow(null),
  lists: array()
    .items({
      id: string(),
      name: string(),
    })
    .optional()
    .allow(null),
});
