import { BoardRequest, RequestParams, Role, Roles, UserPayload } from '@compito/api-interfaces';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CompitoLogger } from '../core/utils/logger.util';
import { getUserDetails } from '../core/utils/payload.util';
import { parseQuery } from '../core/utils/query-parse.util';
import { PrismaService } from '../prisma.service';
import { USER_BASIC_DETAILS } from '../task/task.config';
import { GET_SINGLE_BOARD_SELECT } from './boards.config';

@Injectable()
export class BoardsService {
  private logger = new CompitoLogger('BOARD');
  constructor(private prisma: PrismaService) {}

  async create(data: BoardRequest, user: UserPayload) {
    const { org, role, userId } = getUserDetails(user);
    switch (role.name as Roles) {
      case 'user':
        this.logger.error('create', 'User role cannot create board');
        throw new ForbiddenException('No permission to create board');
      case 'project-admin': {
        try {
          const projectData = await this.prisma.project.findUnique({
            where: {
              id: data.projectId,
            },
            select: {
              members: {
                where: {
                  id: userId,
                },
              },
            },
            rejectOnNotFound: true,
          });
          const userPartOfProject = projectData?.members.length > 0;
          if (!userPartOfProject) {
            this.logger.error('board', 'create', 'User is not part of the project');
            throw new ForbiddenException('No permission to create board');
          }
        } catch (error) {
          if (error?.name === 'NotFoundError') {
            this.logger.error('create', 'Project not found', error);
            throw new BadRequestException('Project not found');
          }
          if (error instanceof HttpException) {
            throw error;
          }
          this.logger.error('create', 'Something went wrong', error);
          throw new InternalServerErrorException('Something went wrong');
        }
        break;
      }
      default: {
        break;
      }
    }
    try {
      const boardData: Prisma.BoardUncheckedCreateInput = {
        ...data,
        orgId: org.id,
        lists: data.lists as any[],
        createdById: userId,
      };
      return await this.prisma.board.create({
        data: boardData,
      });
    } catch (error) {
      this.logger.error('create', 'Failed to create board', error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(query: RequestParams, user: UserPayload) {
    const { role, org, userId } = getUserDetails(user);
    let where: Prisma.BoardWhereInput = {
      orgId: org.id,
    };

    switch (role.name as Roles) {
      case 'user':
      case 'project-admin':
        {
          try {
            const projectData = await this.prisma.project.findMany({
              where: {
                members: {
                  some: {
                    id: userId,
                  },
                },
              },
              select: {
                id: true,
              },
            });
            const projectsAccessibleByUser = projectData.map(({ id }) => id);
            where = {
              ...where,
              projectId: {
                in: projectsAccessibleByUser,
              },
            };
          } catch (error) {
            if (error?.name === 'NotFoundError') {
              this.logger.error('findAll', 'Project not found', error);
              throw new NotFoundException('Project not found');
            }
            this.logger.error('findAll', 'Something went wrong', error);
            throw new InternalServerErrorException('Something went wrong');
          }
        }
        break;
      default:
        break;
    }
    const { skip, limit } = parseQuery(query);
    try {
      const count$ = this.prisma.board.count({ where });
      const orgs$ = this.prisma.board.findMany({
        where,
        skip,
        take: limit,
        include: {
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
      this.logger.error('findAll', 'Something went wrong', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOne(id: string, user: UserPayload) {
    const { role, userId } = getUserDetails(user);
    try {
      const board = await this.prisma.board.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
        select: {
          ...GET_SINGLE_BOARD_SELECT,
          tasks: {
            select: {
              id: true,
              title: true,
              description: true,
              assignees: {
                select: USER_BASIC_DETAILS,
              },

              comments: {
                select: { id: true },
              },
              priority: true,
              board: {
                select: {
                  id: true,
                  name: true,
                },
              },
              list: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
              members: {
                where: {
                  id: userId,
                },
              },
            },
          },
        },
      });
      switch (role.name as Roles) {
        case 'user':
        case 'project-admin': {
          const userHasAccessToBoard = board.project.members.length > 0;
          if (!userHasAccessToBoard) {
            this.logger.error('findOne', 'Not access to the board');
            throw new ForbiddenException('No access to project');
          }
          break;
        }
        default:
          break;
      }
      delete board.project.members;
      return board;
    } catch (error) {
      if (error?.name === 'NotFoundError') {
        this.logger.error('findOne', 'Board not found');
        throw new NotFoundException('Board not found');
      }
      this.logger.error('findOne', 'Something went wrong');
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(id: string, req: BoardRequest, user: UserPayload) {
    const { role, userId, org } = getUserDetails(user);
    await canUpdateBoard(this.prisma, role, id, userId, org.id, 'update');
    try {
      const { lists, name, description } = req;
      const data: Prisma.BoardUncheckedUpdateInput = {
        lists: lists as any[],
        name,
        description,
      };
      const board = await this.prisma.board.update({
        where: {
          id,
        },
        data,
      });
      if (board) {
        return board;
      }
      throw new NotFoundException();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          this.logger.error('update', 'Board not found');
          throw new NotFoundException('Board not found');
        }
      }
      this.logger.error('update', 'Something went wrong');
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string, user: UserPayload) {
    const { role, userId, org } = getUserDetails(user);
    const board = await canUpdateBoard(this.prisma, role, id, userId, org.id, 'delete');
    if (board.orgId !== org.id) {
      throw new ForbiddenException('No permission to delete the board');
    }
    if (board.tasks.length > 0) {
      throw new ConflictException('Cannot delete board as it contains tasks.');
    }
    try {
      const board = await this.prisma.board.delete({
        where: {
          id,
        },
      });
      if (board) {
        return board;
      }
      throw new NotFoundException();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

const canUpdateBoard = async (
  prisma: PrismaService,
  role: Role,
  id: string,
  userId: string,
  org: string,
  operation: string,
) => {
  let boardData: { orgId: string; tasks: Partial<Task>[]; project: any };
  try {
    boardData = await prisma.board.findUnique({
      where: { id },
      select: {
        orgId: true,
        tasks: {
          select: {
            id: true,
          },
        },
        project: {
          select: {
            members: {
              where: {
                id: userId,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    if (error?.name === 'NotFoundError') {
      throw new NotFoundException('Board not found');
    }
  }
  switch (role.name as Roles) {
    case 'user':
      throw new ForbiddenException(`No permission to ${operation} board`);
    case 'project-admin': {
      const userPartOfProject = boardData?.project?.members?.length > 0;
      if (!userPartOfProject) {
        throw new ForbiddenException(`No permission to ${operation} board`);
      }
      break;
    }
    default: {
      if (boardData.orgId !== org) {
        throw new ForbiddenException(`No permission to ${operation} board`);
      }
      break;
    }
  }
  return boardData;
};
