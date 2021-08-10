import { RequestParamsDto, TaskRequest, UserPayload } from '@compito/api-interfaces';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TaskService {
  private logger = new Logger('TASK');
  constructor(private prisma: PrismaService) {}

  async create(data: TaskRequest, user: UserPayload) {
    try {
      const { assignees, priority, tags, ...rest } = data;
      let taskData: Prisma.TaskUncheckedCreateInput = {
        ...rest,
        priority: priority as any,
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
      const { assignees, priority, tags, ...rest } = data;
      let taskData: Prisma.TaskUncheckedUpdateInput = {
        ...rest,
      };
      if (priority) {
        taskData = {
          ...taskData,
          priority: priority as any,
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
      });
      this.logger.debug(task);
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
