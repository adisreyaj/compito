import { RequestParamsDto, TaskRequest, UserPayload } from '@compito/api-interfaces';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Priority, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { getUserDetails } from '../core/utils/payload.util';
import { PrismaService } from '../prisma.service';
import { GET_SINGLE_TASK_SELECT } from './task.config';

@Injectable()
export class TaskService {
  private logger = new Logger('TASK');
  constructor(private prisma: PrismaService) {}

  async create(data: TaskRequest, user: UserPayload) {
    try {
      const { org, userId } = getUserDetails(user);

      const { assignees, priority, tags, boardId, projectId, ...rest } = data;
      let taskData: Prisma.TaskCreateInput = {
        ...rest,
        board: { connect: { id: boardId } },
        project: { connect: { id: projectId } },
        priority: priority ?? Priority.Medium,
        createdBy: {
          connect: { id: userId },
        },
        org: {
          connect: {
            id: org,
          },
        },
        assignees: {
          connect: assignees.map((id) => ({ id })),
        },
        tags: {
          connect: tags.map((id) => ({ id })),
        },
      };
      const task = await this.prisma.task.create({ data: taskData });
      return task;
    } catch (error) {
      this.logger.error('Failed to create task', error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(query: RequestParamsDto) {
    const { skip, limit } = query;
    try {
      const count$ = this.prisma.task.count();
      const orgs$ = this.prisma.task.findMany({
        skip,
        take: limit,
        select: GET_SINGLE_TASK_SELECT,
      });
      const [payload, count] = await Promise.all([orgs$, count$]);
      return {
        payload,
        meta: {
          count,
        },
      };
    } catch (error) {
      this.logger.error('Failed to fetch orgs', error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id,
        },
        select: GET_SINGLE_TASK_SELECT,
      });
      if (task) {
        return task;
      }
      return new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to fetch task', error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, data: TaskRequest) {
    try {
      const { assignees, priority, tags,assignedById, boardId,projectId, orgId,createdById, ...rest } = data;
      let taskData: Prisma.TaskUpdateInput = {
        ...rest,
      };
      if (assignedById) {
        taskData = {
          ...taskData,
          assignedBy: { connect: { id: assignedById } },
        };
      }
      if (priority) {
        taskData = {
          ...taskData,
          priority: priority ?? Priority.Medium,
        };
      }
      if (assignees) {
        taskData = {
          ...taskData,
          assignees: {
            connect: assignees.map((id) => ({ id })),
          },
        };
      }
      if (tags) {
        taskData = {
          ...taskData,
          tags: {
            connect: tags.map((id) => ({ id })),
          },
        };
      }
      const task = await this.prisma.task.update({
        where: {
          id,
        },
        data: taskData,
        select: GET_SINGLE_TASK_SELECT,
      });
      if (task) {
        return task;
      }
      throw new NotFoundException();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
      this.logger.error('Failed to update task', error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const task = await this.prisma.task.delete({
        where: {
          id,
        },
      });
      if (task) {
        return task;
      }
      throw new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to delete task', error);
      throw new InternalServerErrorException();
    }
  }
}
