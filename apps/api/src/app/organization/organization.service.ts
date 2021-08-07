import { OrganizationRequest, RequestParamsDto } from '@compito/api-interfaces';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma.service';

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

  async findAll(query: RequestParamsDto) {
    const { skip, limit, search = null } = query;
    try {
      const count$ = this.prisma.organization.count();
      const orgs$ = this.prisma.organization.findMany({
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
