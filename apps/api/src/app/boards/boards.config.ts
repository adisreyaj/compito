import { Prisma } from '@prisma/client';
import { GET_SINGLE_TASK_SELECT } from '../task/task.config';

export const GET_SINGLE_BOARD_SELECT: Prisma.BoardSelect = {
  id: true,
  name: true,
  lists: true,
  updatedAt: true,
  createdAt: true,
  createdBy: true,
  tasks: {
    select: GET_SINGLE_TASK_SELECT,
  },
  org: true,
  project: true,
};
