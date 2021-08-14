import { RequestParams, User, UserPayload, UserRequest, UserSignupRequest } from '@compito/api-interfaces';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { AppMetadata, AuthenticationClient, ManagementClient, SignUpUserData, UserMetadata } from 'auth0';
import { hashSync } from 'bcrypt';
import cuid from 'cuid';
import { kebabCase } from 'voca';
import { AuthService } from '../auth/auth.service';
import { getUserDetails } from '../core/utils/payload.util';
import { parseQuery } from '../core/utils/query-parse.util';
import { PrismaService } from '../prisma.service';
import { GET_SINGLE_USER_SELECT } from './user.config';
@Injectable()
export class UserService {
  private logger = new Logger('USER');

  managementClient: ManagementClient<AppMetadata, UserMetadata>;
  authClient: AuthenticationClient;
  constructor(private config: ConfigService, private prisma: PrismaService, private auth: AuthService) {
    this.managementClient = this.auth.management;
    this.authClient = this.auth.auth;
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

  async signup(data: UserSignupRequest) {
    const connection = this.config.get('AUTH0_DB');
    if (!connection) {
      throw new Error('Please provide the auth DB name');
    }
    const { email, firstName, lastName, org, password } = data;
    const createUserAndOrg = async () => {
      try {
        const user = await this.prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: hashSync(password, 10),
            verified: false,
            blocked: false,
            org: {
              create: {
                name: org,
                slug: `${kebabCase(org)}-${cuid()}`,
              },
            },
          },
          select: {
            id: true,
            org: {
              select: {
                id: true,
              },
            },
          },
        });
        return user;
      } catch (error) {
        this.logger.error('Failed to create user in DB', error);
        throw new InternalServerErrorException('Failed to creat user');
      }
    };

    const deleteUserFromLocal = async (userId: string, orgId: string) => {
      try {
        await Promise.all([
          this.prisma.user.delete({
            where: {
              id: userId,
            },
          }),
          this.prisma.organization.delete({
            where: {
              id: orgId,
            },
          }),
        ]);
      } catch (error) {
        this.logger.error('Failed to remove user from DB', error);
        throw new InternalServerErrorException('Something went wrong');
      }
    };

    const createUserInAuth0 = async (userId: string, orgId: string) => {
      try {
        const data: SignUpUserData = {
          family_name: lastName,
          given_name: firstName,
          password,
          email,
          connection,
          user_metadata: {
            org: orgId,
            userId: userId,
          },
        };
        return await this.authClient.database.signUp(data);
      } catch (error) {
        await deleteUserFromLocal(userId, orgId);
        this.logger.error('Failed to create user in Auth0', error);
        throw new InternalServerErrorException('Failed to signup');
      }
    };

    const assignRoleToUser = async (userId: string, roles: string[], localUserId: string, orgId: string) => {
      try {
        this.logger.verbose(`Assigning role to user: auth0|${userId}`);
        await this.managementClient.assignRolestoUser(
          { id: `auth0|${userId}` },
          {
            roles,
          },
        );
      } catch (error) {
        await deleteUserFromLocal(localUserId, orgId);
        await this.managementClient.deleteUser({ id: `auth0|${userId}` });
        this.logger.error('Failed to assign role to the user', error);
        throw new InternalServerErrorException('Failed to signup user');
      }
    };
    try {
      const userSaved = await createUserAndOrg();
      const userInAuth0 = await createUserInAuth0(userSaved.id, userSaved.org[0].id);
      this.logger.debug(userInAuth0);
      await assignRoleToUser(userInAuth0._id, ['rol_lyVxmUX8UdHk3856'], userSaved.id, userSaved.org[0].id);
      return { message: 'User signed up successfully' };
    } catch (error) {
      this.logger.error('Failed to create user in Auth0', error);
      throw new InternalServerErrorException('Failed to signup user!');
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
    await this.managementClient.createUser({
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

  async findAll(query: RequestParams & { projectId?: string }, user: UserPayload) {
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
              OR: [
                {
                  projects: {
                    some: {
                      id: query.projectId,
                    },
                  },
                },
                {
                  projectsCreated: {
                    some: {
                      id: query.projectId,
                    },
                  },
                },
              ],
            },
          ],
        };
      }
    }
    const { skip, limit } = parseQuery(query);
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
