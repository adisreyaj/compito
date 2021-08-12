import { RequestParamsDto, User, UserPayload, UserRequest } from '@compito/api-interfaces';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { AppMetadata, ManagementClient, UserMetadata } from 'auth0';
import { getUserDetails } from '../core/utils/payload.util';
import { PrismaService } from '../prisma.service';
import { GET_SINGLE_USER_SELECT } from './user.config';
@Injectable()
export class UserService {
  private logger = new Logger('USER');

  auth0: ManagementClient<AppMetadata, UserMetadata>;
  constructor(private config: ConfigService, private prisma: PrismaService) {
    this.auth0 = new ManagementClient({
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
      clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
    });
  }

  async create(data: UserRequest) {
    let user: User | null = null;
    const connection = this.config.get('AUTH0_DB');
    if (!connection) {
      throw new Error('Please provide the auth DB name');
    }
    user = await this.creatUserLocally(data);
    try {
      if (user) {
        await this.createUserInAuth0(data, connection, user);
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      await this.prisma.user.delete({
        where: {
          id: user.id,
        },
      });
      this.logger.debug('User delete successfully');
      throw new InternalServerErrorException(error.message);
    }
  }

  private async creatUserLocally(data: UserRequest) {
    try {
      const { orgId, ...rest } = data;
      const user = (await this.prisma.user.create({
        data: {
          ...rest,
          org: {
            connect: { id: orgId },
          },
        },
        select: GET_SINGLE_USER_SELECT,
      })) as User;
      this.logger.debug('User created successfully!' + user.id);
      return user;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  private async createUserInAuth0(data: UserRequest, connection: any, user: User) {
    const { email, firstName, lastName, password } = data;
    const { org } = user;
    const orgIds = org.map(({ id }) => id);
    await this.auth0.createUser({
      connection,
      email,
      user_metadata: {
        org: orgIds,
        userId: user.id,
      },
      blocked: false,
      app_metadata: {},
      given_name: firstName,
      family_name: lastName,
      password,
    });
  }

  async findAll(query: RequestParamsDto & { projectId?: string }, user: UserPayload) {
    const { org, role } = getUserDetails(user);
    let whereCondition: Prisma.UserWhereInput = {};
    switch (role) {
      case 'org-admin':
        whereCondition = {
          ...whereCondition,
          org: {
            some: {
              id: org,
            },
          },
        };
      case 'project-admin': {
        if (!query?.projectId) {
          throw new BadRequestException('Project Id is not specified');
        }
        whereCondition = {
          ...whereCondition,
          AND: [
            {
              org: {
                some: {
                  id: org,
                },
              },
            },
            {
              projectId: query.projectId,
            },
          ],
        };
      }
    }
    const { skip, limit } = query;
    try {
      const count$ = this.prisma.user.count({ where: whereCondition });
      const orgs$ = this.prisma.user.findMany({
        where: whereCondition,
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
}
