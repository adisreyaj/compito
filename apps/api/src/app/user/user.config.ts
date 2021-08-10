import { Prisma } from '@prisma/client';

export const GET_SINGLE_USER_SELECT: Prisma.UserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  image: true,
  blocked: true,
  verified: true,
  email: true,
  updatedAt: true,
  createdAt: true,
  tasks: true,
  org: true,
  project: true,
};
