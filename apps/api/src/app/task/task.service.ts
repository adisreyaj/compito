import { RequestParams, Role, Roles, TaskRequest, UserPayload } from '@compito/api-interfaces';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Priority, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { getUserDetails } from '../core/utils/payload.util';
import { parseQuery } from '../core/utils/query-parse.util';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TaskService {
  private logger = new Logger('TASK');
  constructor(private prisma: PrismaService) {}

  async create(data: TaskRequest, user: UserPayload) {
    try {
      const { userId, org, projects, role } = getUserDetails(user);
      const { assignees, priority, tags, boardId, projectId, orgId, ...rest } = data;
      switch (role.name as Roles) {
        case 'user':
        case 'project-admin':
          {
            const isTaskCreatedInProjectUserHaveAccess = projects.findIndex((id) => id === projectId) >= 0;
            if (!isTaskCreatedInProjectUserHaveAccess) {
              throw new ForbiddenException('Not enough permission to create task!');
            }
          }
          break;
        default:
          if (orgId !== org) {
            throw new ForbiddenException('Not enough permission to create task!');
          }
          break;
      }
      const taskData: Prisma.TaskCreateInput = {
        ...rest,
        priority: (priority as any) ?? Priority.Medium,
        createdBy: {
          connect: { id: userId },
        },
        org: {
          connect: {
            id: orgId,
          },
        },
        project: {
          connect: { id: projectId },
        },
        board: {
          connect: {
            id: boardId,
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

  async findAll(query: RequestParams, where: Prisma.TaskWhereInput = {}, user: UserPayload) {
    const { org, role, userId } = getUserDetails(user);
    const { skip, limit, sort = 'updatedAt', order = 'asc' } = parseQuery(query);
    where.orgId = org;
    switch (role.name as Roles) {
      case 'user':
      case 'project-admin':
        {
          let projects = [];
          try {
            const user = await this.prisma.user.findUnique({
              where: {
                id: userId,
              },
              select: {
                projects: {
                  select: {
                    id: true,
                  },
                },
              },
            });
            projects = user.projects.map(({ id }) => id);
          } catch (error) {
            this.logger.error('Failed to fetch user details');
            throw new InternalServerErrorException('Failed to fetch users');
          }
          where.projectId = { in: projects };
        }
        break;
      default:
        break;
    }
    if (Object.prototype.hasOwnProperty.call(query, 'priority')) {
      Object.assign(where, {
        priority: {
          in: (query.priority.split(',') as any[]) ?? [],
        },
      });
    }
    try {
      const count$ = this.prisma.task.count({ where });
      const orgs$ = this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort]: order,
        },
        include: {
          board: {
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
        },
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

  async findAllPriorities() {
    return ['Lowest', 'Low', 'Medium', 'High', 'Highest'];
  }

  async findOne(id: string, user: UserPayload) {
    const { org, projects, role } = getUserDetails(user);
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id,
        },
      });
      if (task) {
        switch (role.name as Roles) {
          case 'user':
          case 'project-admin': {
            const taskBelongsToAccessibleProject = projects.findIndex((id) => id === task.projectId) >= 0;
            if (!taskBelongsToAccessibleProject) {
              throw new ForbiddenException('No access to view task!');
            }
            break;
          }
          default: {
            const taskBelongsToAccessibleOrg = org === task.orgId;
            if (!taskBelongsToAccessibleOrg) {
              throw new ForbiddenException('No access to view task!');
            }
            break;
          }
        }
        return task;
      }
      throw new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to fetch task', error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, data: TaskRequest, user: UserPayload) {
    const { org, role, userId } = getUserDetails(user);
    await this.canUpdateTask(id, role, org, userId);
    try {
      const { assignees, priority, tags, ...rest } = data;
      let taskData: Prisma.TaskUpdateInput = {
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
            set: assignees.map((id) => ({ id })),
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
        include: {
          assignees: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
              email: true,
            },
          },
        },
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

  private async canUpdateTask(id: string, role: Role, org: string, userId: string) {
    let taskData;
    try {
      taskData = await this.prisma.task.findUnique({
        where: {
          id,
        },
        select: {
          orgId: true,
          projectId: true,
        },
        rejectOnNotFound: true,
      });
    } catch (error) {
      this.logger.error('Task not found');
      if (error?.name === 'NotFoundError') {
        throw new NotFoundException('Task not found');
      }
    }
    switch (role.name as Roles) {
      case 'user':
      case 'project-admin':
        try {
          const user = await this.prisma.user.findUnique({
            where: {
              id: userId,
            },
            select: {
              projects: {
                select: {
                  id: true,
                },
              },
            },
          });
          const projects = user.projects.map(({ id }) => id);
          if (projects.findIndex((id) => id === taskData.projectId) < 0) {
            throw new ForbiddenException('Not enough permissions to update the task!');
          }
        } catch (error) {
          this.logger.error('Task Update', error);
          throw new InternalServerErrorException('Failed to update task!');
        }
        break;
      default:
        if (org !== taskData.orgId) {
          throw new ForbiddenException('Not enough permissions to update the task!');
        }
        break;
    }
    return taskData;
  }

  async remove(id: string, user: UserPayload) {
    const { org, role, userId } = getUserDetails(user);
    await this.canUpdateTask(id, role, org, userId);
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
