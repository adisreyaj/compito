import { ProjectRequest, RequestParamsDto } from '@compito/api-interfaces';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectService {
  private logger = new Logger('PROJECT');
  constructor(private prisma: PrismaService) {}

  async create(data: ProjectRequest) {
    try {
      const project = await this.prisma.project.create({
        data,
      });
      return project;
    } catch (error) {
      this.logger.error('Failed to create project', error);
      return new InternalServerErrorException();
    }
  }

  async findAll(query: RequestParamsDto) {
    const { skip, limit, search = null } = query;
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
        data,
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
