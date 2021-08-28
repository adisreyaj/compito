import { RequestParams, Role, Roles, TaskRequest, UserPayload } from '@compito/api-interfaces';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Priority, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as cuid from 'cuid';
import { UploadedObjectInfo } from 'minio';
import { FileStorageService } from '../core/services/file-storage.service';
import { CompitoLogger } from '../core/utils/logger.util';
import { getUserDetails } from '../core/utils/payload.util';
import { parseQuery } from '../core/utils/query-parse.util';
import { PrismaService } from '../prisma.service';
import { USER_BASIC_DETAILS } from './task.config';

@Injectable()
export class TaskService {
  private logger = new CompitoLogger('TASK');
  constructor(private prisma: PrismaService, private fileStorage: FileStorageService) {}

  async create(data: TaskRequest, user: UserPayload) {
    try {
      const { userId, org, projects, role } = getUserDetails(user);
      const { assignees, priority, tags, boardId, projectId, ...rest } = data;
      switch (role.name as Roles) {
        case 'user':
        case 'project-admin':
          {
            const isTaskCreatedInProjectUserHaveAccess = projects.findIndex((id) => id === projectId) >= 0;
            if (!isTaskCreatedInProjectUserHaveAccess) {
              this.logger.error('create', `User don't have access to the project`);
              throw new ForbiddenException('Not enough permission to create task!');
            }
          }
          break;
        default:
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
            id: org.id,
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
      return await this.prisma.task.create({ data: taskData });
    } catch (error) {
      this.logger.error('create', `Failed to create task`, error);
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async findAll(query: RequestParams, user: UserPayload, where: Prisma.TaskWhereInput = {}) {
    const { org, role, userId } = getUserDetails(user);
    const { skip, limit, sort = 'updatedAt', order = 'asc' } = parseQuery(query);
    where.orgId = org.id;
    switch (role.name as Roles) {
      case 'user':
      case 'project-admin':
        {
          let projects = [];
          try {
            const userData = await this.prisma.user.findUnique({
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
            projects = userData.projects.map(({ id }) => id);
          } catch (error) {
            this.logger.error('findAll', 'Failed to fetch user details', error);
            throw new InternalServerErrorException('Failed to fetch tasks');
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
      this.logger.error('findAll', 'Failed to fetch orgs', error);
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
        rejectOnNotFound: true,
        include: {
          assignees: {
            select: USER_BASIC_DETAILS,
          },
          createdBy: {
            select: USER_BASIC_DETAILS,
          },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              reactions: true,
              createdBy: {
                select: USER_BASIC_DETAILS,
              },
            },
          },
        },
      });
      switch (role.name as Roles) {
        case 'user':
        case 'project-admin': {
          const taskBelongsToAccessibleProject = projects.findIndex((projectId) => projectId === task.projectId) >= 0;
          if (!taskBelongsToAccessibleProject) {
            this.logger.error('findOne', `Task belongs to project the user doesn't have access`);
            throw new ForbiddenException('No access to view task!');
          }
          break;
        }
        default: {
          const taskBelongsToAccessibleOrg = org.id === task.orgId;
          if (!taskBelongsToAccessibleOrg) {
            this.logger.error('findOne', `Task belongs to org the user doesn't have access`);
            throw new ForbiddenException('No access to view task!');
          }
          break;
        }
      }
      return task;
    } catch (error) {
      if (error?.name === 'NotFoundError') {
        this.logger.error('findOne', 'Org not found', error);
        throw new NotFoundException('Task not found');
      }
      this.logger.error('findOne', 'Failed to fetch task', error);
      throw new InternalServerErrorException('Failed to fetch task');
    }
  }

  async update(id: string, data: TaskRequest, user: UserPayload) {
    const { org, role, userId } = getUserDetails(user);
    await this.canUpdateTask(id, role, org.id, userId);
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
            set: assignees.map((assigneeId) => ({ id: assigneeId })),
          },
        };
      }
      if (tags) {
        taskData = {
          ...taskData,
          tags: {
            connect: tags.map((tagId) => ({ id: tagId })),
          },
        };
      }
      return await this.prisma.task.update({
        where: {
          id,
        },
        data: taskData,
        include: {
          createdBy: {
            select: USER_BASIC_DETAILS,
          },
          assignees: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
              email: true,
            },
          },
          attachments: {
            select: {
              id: true,
              path: true,
              createdAt: true,
              createdBy: {
                select: USER_BASIC_DETAILS,
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          this.logger.error('update', 'Task not found', error);
          throw new NotFoundException('Task not found');
        }
      }
      this.logger.error('update', 'Failed to update task', error);
      throw new InternalServerErrorException('Failed to update task');
    }
  }

  async remove(id: string, user: UserPayload) {
    const { org, role, userId } = getUserDetails(user);
    await this.canUpdateTask(id, role, org.id, userId);
    try {
      return await this.prisma.task.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error('delete', 'Failed to delete task', error);
      throw new InternalServerErrorException('Failed to delete task');
    }
  }

  async addComment(id: string, content: string, user: UserPayload) {
    try {
      const { userId } = getUserDetails(user);
      return await this.prisma.comment.create({
        data: {
          content,
          createdById: userId,
          taskId: id,
        },
        select: {
          content: true,
          id: true,
          createdAt: true,
          createdBy: {
            select: USER_BASIC_DETAILS,
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          this.logger.error('addComment', 'Update data not proper, missing foreign key', error);
          throw new BadRequestException('Failed to add comment');
        }
      }
      this.logger.error('addComment', 'Failed to add comment', error);
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
      if (error?.name === 'NotFoundError') {
        this.logger.error('canUpdateTask', 'Task not found', error);
        throw new NotFoundException('Task not found');
      }
      this.logger.error('canUpdateTask', 'Failed to fetch task', error);
      throw new InternalServerErrorException('Failed to update task');
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
          const projects = user.projects.map((project) => project.id);
          if (projects.findIndex((projectId) => projectId === taskData.projectId) < 0) {
            this.logger.error('canUpdateTask', `Task belongs to project which user doesn't have access`);
            throw new ForbiddenException('Not enough permissions to update the task!');
          }
        } catch (error) {
          this.logger.error('canUpdateTask', 'Task Update', error);
          throw new InternalServerErrorException('Failed to update task!');
        }
        break;
      default:
        if (org !== taskData.orgId) {
          this.logger.error('canUpdateTask', `Task belongs to org which user doesn't have access`);
          throw new ForbiddenException('Not enough permissions to update the task!');
        }
        break;
    }
    return taskData;
  }

  async addAttachments(id: string, files: Express.Multer.File[], user: UserPayload) {
    let uploadedFiles: { result: UploadedObjectInfo; filePath: string }[];
    const { org, userId } = getUserDetails(user);
    const folder = `${org.id}/attachments`;
    try {
      await this.prisma.task.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      });
    } catch (error) {
      if (error?.name === 'NotFoundError') {
        this.logger.error('update', 'Task not found', error);
        throw new NotFoundException('Task not found');
      }
      this.logger.error('addAttachments', 'Failed to upload attachment', error);
      throw new InternalServerErrorException('Failed to add attachments to task!');
    }
    try {
      uploadedFiles = await Promise.all(files.map((file) => this.fileStorage.upload(file, cuid(), folder)));
      const attachments: Prisma.AttachmentUncheckedCreateWithoutTaskInput[] = uploadedFiles
        .filter(Boolean)
        .map((item) => ({
          createdById: userId,
          orgId: org.id,
          path: item.filePath,
        }));
      return await this.prisma.task.update({
        where: {
          id,
        },
        data: {
          attachments: {
            createMany: {
              data: attachments,
            },
          },
        },
        include: {
          createdBy: {
            select: USER_BASIC_DETAILS,
          },
          assignees: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
              email: true,
            },
          },
          attachments: {
            select: {
              id: true,
              path: true,
              createdAt: true,
              createdBy: {
                select: USER_BASIC_DETAILS,
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('addAttachments', 'Failed to upload attachment', error);
      throw new InternalServerErrorException('Failed to add attachments to task!');
    }
  }
}
