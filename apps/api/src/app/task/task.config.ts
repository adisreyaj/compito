import { Prisma } from '@prisma/client';

export const USER_BASIC_DETAILS: Prisma.UserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  image: true,
};
export const GET_SINGLE_TASK_SELECT: Prisma.TaskSelect = {
  id: true,
  title: true,
  description: true,
  assignees: {
    select: USER_BASIC_DETAILS,
  },
  board: {
    select: {
      id: true,
      name: true,
    },
  },
  list: true,
  comments: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      createdBy: {
        select: USER_BASIC_DETAILS,
      },
      reactions: true,
    },
  },
  assignedBy: { select: USER_BASIC_DETAILS },
  org: {
    select: {
      id: true,
      name: true,
    },
  },
  project: {
    select: {
      id: true,
      name: true,
    },
  },
  createdBy: {
    select: USER_BASIC_DETAILS,
  },
  priority: true,
  updatedAt: true,
  createdAt: true,
};
