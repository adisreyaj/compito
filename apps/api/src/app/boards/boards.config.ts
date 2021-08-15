import { Prisma } from '@prisma/client';

export const GET_SINGLE_BOARD_SELECT: Prisma.BoardSelect = {
  id: true,
  name: true,
  lists: true,
  updatedAt: true,
  createdAt: true,
  createdBy: true,
  tasks: true,
  org: true,
  project: true,
};
