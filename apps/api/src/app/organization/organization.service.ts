import { OrganizationRequest, RequestParams, Roles, UpdateMembersRequest, UserPayload } from '@compito/api-interfaces';
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
export class OrganizationService {
  private logger = new Logger('ORG');
  constructor(private prisma: PrismaService) {}

  async create(data: OrganizationRequest) {
    try {
      const org = await this.prisma.organization.create({
        data,
      });
      return org;
    } catch (error) {
      this.logger.error('Failed to create org', error);
      return new InternalServerErrorException();
    }
  }

  async findAll(query: RequestParams, user: UserPayload) {
    const { userId, role } = getUserDetails(user);
    const { skip, limit } = parseQuery(query);
    let where: Prisma.OrganizationWhereInput = {};
    switch (role.name) {
      case 'super-admin':
        where = {};
        break;
      /**
       * Admin can view all orgs created by him
       * and all orgs he is member of
       */
      case 'admin':
        where = {
          OR: [
            {
              createdById: userId,
            },
            {
              members: {
                some: {
                  id: userId,
                },
              },
            },
          ],
        };
        break;
      default:
        throw new ForbiddenException('Not enough permissions');
    }
    try {
      const count$ = this.prisma.organization.count({
        where,
      });
      const orgs$ = this.prisma.organization.findMany({
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

  async findOne(id: string, user: UserPayload) {
    const { userId, role, org } = getUserDetails(user);
    let findOptions: Prisma.OrganizationFindFirstArgs = {
      where: {
        id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        members: {
          select: USER_BASIC_DETAILS,
        },
        boards: true,
        name: true,
        projects: true,
        slug: true,
        tags: true,
        tasks: true,
      },
    };
    try {
      switch (role.name as Roles) {
        case 'user':
        case 'project-admin': {
          const userData = await this.prisma.user.findUnique({
            where: {
              id: userId,
            },
            select: {
              projects: {
                select: {
                  id: true,
                  members: {
                    select: { id: true },
                  },
                },
              },
            },
          });
          const membersOfProjectsUserHaveAccessTo = userData.projects.reduce((acc: string[], curr) => {
            return [...acc, ...curr.members.map(({ id }) => id)];
          }, []);
          /**
           * Only orgs he is part or owner of
           */
          findOptions.where = {
            id,
            members: {
              some: {
                id: userId,
              },
            },
            createdById: userId,
          };
          /**
           * Return only members of projects the user is part of
           */
          findOptions.select.members = {
            select: USER_BASIC_DETAILS,
            where: {
              orgs: {
                some: {
                  id: {
                    in: membersOfProjectsUserHaveAccessTo,
                  },
                },
              },
            },
          };
          break;
        }
        case 'org-admin':
        case 'admin': {
          /**
           * Only orgs he is part of or owner of
           */
          findOptions.where = {
            id,
            createdById: userId,
            members: {
              some: {
                id: userId,
              },
            },
          };
          break;
        }
      }
      const org = await this.prisma.organization.findFirst(findOptions);
      if (org) {
        return org;
      }
      return new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to fetch org', error);
      return new InternalServerErrorException();
    }
  }

  async update(id: string, data: OrganizationRequest, user: UserPayload) {
    const { userId, role } = getUserDetails(user);
    let where: Prisma.OrganizationWhereUniqueInput = {
      id,
    };
    await this.canUpdateOrg(userId, id, role.name as Roles);
    try {
      const org = await this.prisma.organization.update({
        where,
        data,
      });
      this.logger.debug(org);
      if (org) {
        return org;
      }
      return new NotFoundException();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return new NotFoundException();
        }
      }
      this.logger.error('Failed to update org', error);
      return new InternalServerErrorException();
    }
  }

  async updateMembers(id: string, data: UpdateMembersRequest, user: UserPayload) {
    const { userId, role } = getUserDetails(user);
    await this.canUpdateOrg(userId, id, role.name as Roles);
    try {
      let updateData: Prisma.OrganizationUpdateInput = {};
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
      const project = await this.prisma.organization.update({
        where: {
          id,
        },
        data: updateData,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          members: {
            select: USER_BASIC_DETAILS,
          },
          boards: true,
          name: true,
          projects: true,
          slug: true,
          tags: true,
          tasks: true,
        },
      });
      if (project) {
        return project;
      }
      return new NotFoundException();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return new NotFoundException();
        }
      }
      this.logger.error('Failed to update members', error);
      return new InternalServerErrorException();
    }
  }

  async remove(id: string, user: UserPayload) {
    const { userId, role } = getUserDetails(user);
    await this.canDeleteOrg(userId, id, role.name as Roles);
    try {
      const org = await this.prisma.organization.delete({
        where: {
          id,
        },
      });
      if (org) {
        return org;
      }
      return new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to delete org', error);
      return new InternalServerErrorException();
    }
  }

  private canUpdateOrg = async (userId: string, orgId: string, role: Roles) => {
    let orgData: any = null;
    try {
      orgData = await this.prisma.organization.findUnique({
        where: { id: orgId },
        select: {
          createdById: true,
          members: {
            select: { id: true },
          },
        },
        rejectOnNotFound: true,
      });
    } catch (error) {
      if (error?.name === 'NotFoundError') {
        throw new NotFoundException('Org not found');
      }
    }
    switch (role as Roles) {
      /**
       * Can update the org if:
       * 1. Created by the user
       * 2. Is part of the org
       */
      case 'admin':
      case 'org-admin': {
        if (orgData.createdById !== userId || orgData.members.findIndex(({ id }) => id === userId) < 0) {
          throw new ForbiddenException('No permission to update the org');
        }
      }
      /**
       * Can update the org if:
       * 1. Created by the user
       */
      case 'user':
      case 'project-admin': {
        if (orgData.createdById !== userId) {
          throw new ForbiddenException('No permission to update the org');
        }
      }
    }
    return orgData;
  };
  private canDeleteOrg = async (userId: string, orgId: string, role: Roles) => {
    let orgData: any = null;
    try {
      orgData = await this.prisma.organization.findUnique({
        where: { id: orgId },
        select: {
          createdById: true,
          members: {
            select: { id: true },
          },
        },
        rejectOnNotFound: true,
      });
    } catch (error) {
      if (error?.name === 'NotFoundError') {
        throw new NotFoundException('Org not found');
      }
    }
    switch (role as Roles) {
      /**
       * Can delete all orgs
       */
      case 'super-admin': {
        break;
      }
      /**
       * Can delete the org if:
       * 1. Created by the user
       * 2. Is part of the org
       */
      case 'admin': {
        if (orgData.createdById !== userId || orgData.members.findIndex(({ id }) => id === userId) < 0) {
          throw new ForbiddenException('No permission to delete the org');
        }
      }
      /**
       * Can delete the org if:
       * 1. Created by the user
       */
      default:
        if (orgData.createdById !== userId) {
          throw new ForbiddenException('No permission to delete the org');
        }
    }
    return orgData;
  };
}
