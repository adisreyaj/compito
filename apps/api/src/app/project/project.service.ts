import { ProjectRequest, RequestParams, Role, Roles, UpdateMembersRequest, UserPayload } from '@compito/api-interfaces';
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
import { USER_BASIC_DETAILS } from '../task/task.config';

@Injectable()
export class ProjectService {
  private logger = new Logger('PROJECT');
  constructor(private prisma: PrismaService) {}

  async create(data: ProjectRequest, user: UserPayload) {
    const { org, role, userId } = getUserDetails(user);
    const { orgId, ...rest } = data;
    switch (role.name) {
      case 'super-admin':
        break;
      case 'admin':
      case 'org-admin':
        if (orgId !== org) {
          this.logger.error(`CREATE:PROJECT-->Org doesn't match`);
          throw new ForbiddenException('No permissions to create project');
        }
        break;
      default:
        this.logger.error(`CREATE:PROJECT-->Org doesn't match`);
        throw new ForbiddenException('No permissions to create project');
    }
    try {
      let members = [];
      if (data.members?.length > 0) {
        members = data.members.map((id) => ({ id }));
        if (!data.members.includes(userId)) {
          members.push({ id: userId });
        }
      } else {
        members.push({ id: userId });
      }
      const projectData: Prisma.ProjectCreateInput = {
        ...rest,
        org: {
          connect: {
            id: orgId,
          },
        },
        createdBy: {
          connect: {
            id: userId,
          },
        },
        members: {
          connect: members,
        },
      };
      const project = await this.prisma.project.create({
        data: projectData,
        include: {
          members: {
            select: USER_BASIC_DETAILS,
          },
        },
      });
      return project;
    } catch (error) {
      this.logger.error('Failed to create project', error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(query: RequestParams, user: UserPayload) {
    const { skip, limit, sort = 'updatedAt', order = 'desc' } = parseQuery(query);
    const { org, role, userId } = getUserDetails(user);
    let where: Prisma.ProjectWhereInput = {
      orgId: org,
    };
    const select: Prisma.ProjectSelect = {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      boards: true,
      members: { select: USER_BASIC_DETAILS },
    };
    switch (role.name as Roles) {
      case 'user':
      case 'project-admin': {
        where = {
          ...where,
          members: {
            some: {
              id: userId,
            },
          },
        };
        break;
      }
      default:
        break;
    }
    try {
      const count$ = this.prisma.project.count({ where });
      const orgs$ = this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort]: order,
        },
        select,
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

  async findOne(id: string, user: UserPayload) {
    const { role, userId } = getUserDetails(user);
    try {
      const project = await this.prisma.project.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          boards: true,
          members: { select: USER_BASIC_DETAILS },
        },
      });
      if (project) {
        switch (role.name as Roles) {
          case 'user':
          case 'project-admin': {
            const isUserPartOfProject = (project.members as any[]).findIndex(({ id }) => id === userId) >= 0;
            if (!isUserPartOfProject) {
              throw new ForbiddenException('No access to project');
            }
            break;
          }
          default:
            break;
        }
        return project;
      }
      throw new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to fetch project', error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, req: ProjectRequest, user: UserPayload) {
    const { role, userId } = getUserDetails(user);
    await this.canUpdateProject(role, id, userId);
    const { members, orgId, createdById, ...rest } = req;
    let data: Prisma.ProjectUpdateInput = { ...rest };
    if (members) {
      data = {
        ...data,
        members: {
          set: members.map((id) => ({ id })),
        },
      };
    }
    try {
      const project = await this.prisma.project.update({
        where: {
          id,
        },
        data,
        select: {
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          boards: true,
          members: { select: USER_BASIC_DETAILS },
        },
      });
      this.logger.debug(project);
      if (project) {
        return project;
      }
      throw new NotFoundException();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
      this.logger.error('Failed to update project', error);
      throw new InternalServerErrorException();
    }
  }

  async updateMembers(id: string, data: UpdateMembersRequest, user: UserPayload) {
    const { role, userId } = getUserDetails(user);
    await this.canUpdateProject(role, id, userId);
    try {
      let updateData: Prisma.ProjectUpdateInput = {};
      switch (data.type) {
        case 'modify':
          {
            const itemsToRemove = data?.remove?.length > 0 ? data.remove.map((id) => ({ id })) : [];
            const itemsToAdd = data?.add?.length > 0 ? data.add.map((id) => ({ id })) : [];
            updateData = {
              members: {
                disconnect: itemsToRemove,
                connect: itemsToAdd,
              },
            };
          }
          break;
        case 'set':
          {
            const itemsToSet = data?.set.length > 0 ? data.set.map((id) => ({ id })) : [];
            updateData = {
              members: {
                set: itemsToSet,
              },
            };
          }
          break;
      }
      const project = await this.prisma.project.update({
        where: {
          id,
        },
        data: updateData,
        select: {
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          boards: true,
          members: { select: USER_BASIC_DETAILS },
        },
      });
      if (project) {
        return project;
      }
      throw new NotFoundException();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
      this.logger.error('Failed to update members', error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string, user: UserPayload) {
    const { role, userId, projects } = getUserDetails(user);
    switch (role.name as Roles) {
      case 'user':
      case 'project-admin':
        throw new ForbiddenException('No permission to delete the project');
      case 'super-admin':
        break;
      default:
        if (!projects.includes(id)) {
          throw new ForbiddenException('No permission to delete the project');
        }
        break;
    }
    try {
      const project = await this.prisma.project.delete({
        where: {
          id,
        },
      });
      if (project) {
        return project;
      }
      throw new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to delete project', error);
      throw new InternalServerErrorException();
    }
  }

  private async canUpdateProject(role: Role, id: string, userId: string) {
    switch (role.name as Roles) {
      case 'user':
        throw new ForbiddenException('Cannot update project');
      case 'project-admin':
        try {
          const projectData = await this.prisma.project.findUnique({
            where: {
              id,
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
            throw new ForbiddenException('No permission to update the project');
          }
        } catch (error) {
          if (error?.name === 'NotFoundError') {
            throw new NotFoundException('Project not found');
          }
        }
    }
  }
}
