import { BoardRequest, RequestParams, Role, Roles, UserPayload } from '@compito/api-interfaces';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { getUserDetails } from '../core/utils/payload.util';
import { parseQuery } from '../core/utils/query-parse.util';
import { PrismaService } from '../prisma.service';
import { GET_SINGLE_BOARD_SELECT } from './boards.config';

@Injectable()
export class BoardsService {
  private logger = new Logger('BOARD');
  constructor(private prisma: PrismaService) {}

  async create(data: BoardRequest, user: UserPayload, currentOrg: string) {
    const { orgs, role, userId } = getUserDetails(user);
    switch (role.name as Roles) {
      case 'user':
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
            throw new ForbiddenException('No permission to create board');
          }
        } catch (error) {
          if (error?.name === 'NotFoundError') {
            throw new NotFoundException('Project not found');
          }
        }
      }

      default:
        if (!orgs.includes(currentOrg)) {
          throw new ForbiddenException('No permission to create board');
        }
    }
    try {
      const boardData: Prisma.BoardUncheckedCreateInput = {
        ...data,
        lists: data.lists as any[],
        orgId: currentOrg,
        createdById: userId,
      };
      const board = await this.prisma.board.create({
        data: boardData,
      });
      return board;
    } catch (error) {
      this.logger.error('Failed to create board', error);
      return new InternalServerErrorException();
    }
  }

  async findAll(query: RequestParams, user: UserPayload, currentOrg: string) {
    const { role, userId } = getUserDetails(user);
    let where: Prisma.BoardWhereInput = {
      orgId: currentOrg,
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
              throw new NotFoundException('Project not found');
            }
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
      return new InternalServerErrorException();
    }
  }

  async findOne(id: string, user: UserPayload, currentOrg: string) {
    const { role, userId } = getUserDetails(user);
    try {
      const board = await this.prisma.board.findUnique({
        where: {
          id,
        },
        select: {
          ...GET_SINGLE_BOARD_SELECT,
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
      if (board) {
        switch (role.name as Roles) {
          case 'user':
          case 'project-admin': {
            const userHasAccessToBoard = board.project.members.length > 0;
            if (!userHasAccessToBoard) {
              throw new ForbiddenException('No access to project');
            }
            break;
          }
          default:
            break;
        }
        delete board.project.members;
        return board;
      }
      return new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to fetch board', error);
      return new InternalServerErrorException();
    }
  }

  async update(id: string, req: BoardRequest, user: UserPayload, currentOrg: string) {
    const { role, userId, orgs } = getUserDetails(user);
    await canUpdateBoard(role, id, userId, orgs, currentOrg, 'update');
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
      return new NotFoundException();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return new NotFoundException();
        }
      }
      this.logger.error('Failed to update board', error);
      return new InternalServerErrorException();
    }
  }

  async remove(id: string, user: UserPayload, currentOrg: string) {
    const { role, userId, orgs } = getUserDetails(user);
    await canUpdateBoard(role, id, userId, orgs, currentOrg, 'delete');
    try {
      const board = await this.prisma.board.delete({
        where: {
          id,
        },
      });
      if (board) {
        return board;
      }
      return new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to delete board', error);
      return new InternalServerErrorException();
    }
  }
}
async function canUpdateBoard(
  role: Role,
  id: string,
  userId: string,
  orgs: string[],
  currentOrg: string,
  operation: string,
) {
  switch (role.name as Roles) {
    case 'user':
      throw new ForbiddenException(`No permission to ${operation} board`);
    case 'project-admin': {
      try {
        const boardData = await this.prisma.board.findUnique({
          where: { id },
          select: {
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
        const userPartOfProject = boardData?.project?.members?.length > 0;
        if (!userPartOfProject) {
          throw new ForbiddenException(`No permission to ${operation} board`);
        }
      } catch (error) {
        if (error?.name === 'NotFoundError') {
          throw new NotFoundException('Board not found');
        }
      }
      break;
    }
    default:
      if (!orgs.includes(currentOrg)) {
        throw new ForbiddenException(`No permission to ${operation} board`);
      }
      break;
  }
}
