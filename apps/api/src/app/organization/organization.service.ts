import { OrganizationRequest, RequestParams, UpdateMembersRequest, UserPayload } from '@compito/api-interfaces';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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
    const { org, userId } = getUserDetails(user);
    const { skip, limit, search = null } = parseQuery(query);
    try {
      const count$ = this.prisma.organization.count({
        where: {
          OR: [
            {
              id: {
                in: [org],
              },
            },
            {
              members: {
                some: {
                  id: userId,
                },
              },
            },
          ],
        },
      });
      const orgs$ = this.prisma.organization.findMany({
        where: {
          OR: [
            {
              id: {
                in: [org],
              },
            },
            {
              members: {
                some: {
                  id: userId,
                },
              },
            },
          ],
        },
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

  async findOne(id: string) {
    try {
      const org = await this.prisma.organization.findUnique({
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
      });
      if (org) {
        return org;
      }
      return new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to fetch org', error);
      return new InternalServerErrorException();
    }
  }

  async update(id: string, data: OrganizationRequest) {
    try {
      const org = await this.prisma.organization.update({
        where: {
          id,
        },
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

  async updateMembers(id: string, data: UpdateMembersRequest) {
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

  async remove(id: string) {
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
}
