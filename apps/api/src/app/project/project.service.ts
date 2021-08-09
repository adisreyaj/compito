import { ProjectRequest, RequestParamsDto, UserPayload } from '@compito/api-interfaces';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { getUserDetails } from '../core/utils/payload.util';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectService {
  private logger = new Logger('PROJECT');
  constructor(private prisma: PrismaService) {}

  async create(data: ProjectRequest, user: UserPayload) {
    const { org, role, userId } = getUserDetails(user);
    if (role !== 'super-admin' && data.orgId !== org) {
      throw new UnauthorizedException('No access to create project');
    }
    try {
      const projectData: Prisma.ProjectUncheckedCreateInput = {
        ...data,
        orgId: org,
        createdById: userId,
        members: {
          connect: data.members.map((id) => ({ id })),
        },
      };
      const project = await this.prisma.project.create({
        data: projectData,
      });
      return project;
    } catch (error) {
      this.logger.error('Failed to create project', error);
      return new InternalServerErrorException();
    }
  }

  async findAll(query: RequestParamsDto) {
    const { skip, limit } = query;
    try {
      const count$ = this.prisma.project.count();
      const orgs$ = this.prisma.project.findMany({
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
      const project = await this.prisma.project.findUnique({
        where: {
          id,
        },
      });
      if (project) {
        return project;
      }
      return new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to fetch project', error);
      return new InternalServerErrorException();
    }
  }

  async update(id: string, data: ProjectRequest) {
    try {
      const project = await this.prisma.project.update({
        where: {
          id,
        },
        data: {},
      });
      this.logger.debug(project);
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
      this.logger.error('Failed to update project', error);
      return new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const project = await this.prisma.project.delete({
        where: {
          id,
        },
      });
      if (project) {
        return project;
      }
      return new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to delete project', error);
      return new InternalServerErrorException();
    }
  }
}
