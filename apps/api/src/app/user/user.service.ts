import { RequestParams, Role, UserPayload, UserRequest, UserSignupRequest } from '@compito/api-interfaces';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { AppMetadata, AuthenticationClient, ManagementClient, SignUpUserData, UserMetadata } from 'auth0';
import { hashSync } from 'bcrypt';
import * as cuid from 'cuid';
import { verify } from 'jsonwebtoken';
import { kebabCase } from 'voca';
import { AuthService } from '../auth/auth.service';
import { getUserDetails } from '../core/utils/payload.util';
import { parseQuery } from '../core/utils/query-parse.util';
import { PrismaService } from '../prisma.service';
import { USER_BASIC_DETAILS } from '../task/task.config';
@Injectable()
export class UserService {
  private logger = new Logger('USER');

  managementClient: ManagementClient<AppMetadata, UserMetadata>;
  authClient: AuthenticationClient;
  constructor(private config: ConfigService, private prisma: PrismaService, private auth: AuthService) {
    this.managementClient = this.auth.management;
    this.authClient = this.auth.auth;
  }

  // TODO: add jwt based validation
  async getUserPermissions(userId: string, orgId: string) {
    try {
      const userRole = this.prisma.userRoleOrg.findFirst({
        where: {
          userId,
          orgId,
        },
        select: {
          role: {
            select: {
              id: true,
              name: true,
              permissions: true,
            },
          },
        },
      });
      this.logger.debug('Fetched user role');
      return userRole;
    } catch (error) {
      this.logger.error('Failed to retrieve user permissions');
      throw new InternalServerErrorException('Failed to retrieve permissions');
    }
  }

  async getUserOrgs(userId: string, sessionToken: string) {
    try {
      const secret = this.config.get('SESSION_TOKEN_SECRET');
      if (!secret) {
        throw new Error('Please provide the Session Token Secret');
      }
      const token = verify(sessionToken, secret);
      if (!token) {
        throw new ForbiddenException('Session not valid. Please login again!');
      }
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          orgs: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user orgs');
    }
  }
  async getUserProjects(userId: string, orgId: string, sessionToken: string) {
    try {
      const secret = this.config.get('SESSION_TOKEN_SECRET');
      if (!secret) {
        throw new Error('Please provide the Session Token Secret');
      }
      const token = verify(sessionToken, secret);
      if (!token) {
        throw new ForbiddenException('Session not valid. Please login again!');
      }
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          projects: {
            select: {
              id: true,
            },
            where: {
              orgId,
            },
          },
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to fetch user orgs');
    }
  }

  async signup(data: UserSignupRequest) {
    const connection = this.config.get('AUTH0_DB');
    if (!connection) {
      throw new Error('Please provide the auth DB name');
    }
    let role: Role;
    try {
      role = await this.prisma.role.findFirst({
        where: {
          name: 'admin',
        },
        rejectOnNotFound: true,
      });
      this.logger.debug('Admin role found', role.id);
    } catch (error) {
      this.logger.error('Failed to fetch the roles');
      throw new InternalServerErrorException('Failed to create user!');
    }
    const { email, firstName, lastName, org, password } = data;
    const createUserAndOrg = async () => {
      try {
        const userId = cuid();
        const orgId = cuid();
        const [, user] = await this.prisma.$transaction([
          this.prisma.user.create({
            data: {
              id: userId,
              firstName,
              lastName,
              email,
              password: hashSync(password, 10),
              verified: false,
              blocked: false,
              orgs: {
                create: {
                  id: orgId,
                  name: org,
                  slug: `${kebabCase(org)}-${cuid()}`,
                  createdBy: {
                    connect: { id: userId },
                  },
                },
              },
            },
            select: {
              id: true,
            },
          }),
          this.prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              roles: {
                create: {
                  orgId: orgId,
                  roleId: role.id,
                },
              },
            },
            select: {
              id: true,
              orgs: {
                select: {
                  id: true,
                },
              },
              roles: {
                select: {
                  id: true,
                  orgId: true,
                  role: {
                    select: {
                      name: true,
                      id: true,
                    },
                  },
                },
              },
            },
          }),
        ]);
        this.logger.debug('User created locally', user.id);
        return { user, orgId: user.orgs[0].id };
      } catch (error) {
        this.logger.error('Failed to create user in DB', error);
        throw new InternalServerErrorException('Failed to create user');
      }
    };

    const deleteUserFromLocal = async (userId: string, orgId: string) => {
      try {
        // await Promise.all([
        //   this.prisma.userRoleOrg.delete({
        //     where: {
        //     }
        //   })
        //   this.prisma.organization.delete({
        //     where: {
        //       id: orgId,
        //     },
        //   }),
        //   this.prisma.user.delete({
        //     where: {
        //       id: userId,
        //     },
        //   }),
        // ]);
      } catch (error) {
        this.logger.error('Failed to remove user from DB', error);
        throw new InternalServerErrorException('Something went wrong');
      }
    };

    const createUserInAuth0 = async (
      userId: string,
      orgId: string,
      roles: Record<string, { name: string; id: string }>,
    ) => {
      try {
        const data: SignUpUserData = {
          family_name: lastName,
          given_name: firstName,
          password,
          email,
          connection,
          user_metadata: {
            orgs: JSON.stringify([orgId]),
            userId: userId,
            roles: JSON.stringify(roles),
          },
        };
        return await this.authClient.database.signUp(data);
      } catch (error) {
        await deleteUserFromLocal(userId, orgId);
        this.logger.error('Failed to create user in Auth0', error);
        throw new InternalServerErrorException('Failed to signup');
      }
    };
    try {
      const userSaved = await createUserAndOrg();
      const roles = userSaved.user.roles.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.orgId]: curr.role,
        };
      }, {});
      const userInAuth0 = await createUserInAuth0(userSaved.user.id, userSaved.orgId, roles);
      this.logger.debug('User created locally', userInAuth0._id);
      return userInAuth0;
    } catch (error) {
      this.logger.error('Failed to create user in Auth0', error);
      throw new InternalServerErrorException('Failed to signup user!');
    }
  }

  async findAll(query: RequestParams, user: UserPayload) {
    const { org, role, userId, projects } = getUserDetails(user);
    let whereCondition: Prisma.UserWhereInput = {};
    switch (role.name) {
      /**
       * 1. Users of the specified Org that are part of projects he/she is a member of
       */
      case 'user':
        {
          whereCondition = {
            ...whereCondition,
            AND: [
              {
                orgs: {
                  some: {
                    id: org,
                  },
                },
              },
              {
                projects: {
                  some: {
                    id: {
                      in: projects ?? [],
                    },
                  },
                },
              },
            ],
          };
        }
        break;
      /**
       * Super admin, Org Admin and Project Admin can see all the users of his org
       */
      default:
        whereCondition = {
          ...whereCondition,
          orgs: {
            some: {
              id: org,
            },
          },
        };
        break;
    }
    const { skip, limit } = parseQuery(query);
    try {
      const count$ = this.prisma.user.count({ where: whereCondition });
      const orgs$ = this.prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: { ...USER_BASIC_DETAILS, orgs: { select: { id: true, name: true } } },
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
  async find(id: string, user: UserPayload) {
    const { org, role, projects } = getUserDetails(user);
    let whereCondition: Prisma.UserWhereInput = {
      id,
    };
    switch (role.name) {
      /**
       * 1. Users of the specified Org that are part of projects he/she is a member of
       */
      case 'user':
        {
          whereCondition = {
            ...whereCondition,
            AND: [
              {
                orgs: {
                  some: {
                    id: org,
                  },
                },
              },
              {
                projects: {
                  some: {
                    id: {
                      in: projects ?? [],
                    },
                  },
                },
              },
            ],
          };
        }
        break;
      /**
       * Super admin, Org Admin and Project Admin can see all the users of his org
       */
      default:
        whereCondition = {
          ...whereCondition,
          orgs: {
            some: {
              id: org,
            },
          },
        };
        break;
    }
    try {
      const user = await this.prisma.user.findFirst({
        where: whereCondition,
        select: { ...USER_BASIC_DETAILS, orgs: { select: { id: true, name: true } } },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error('Failed to fetch orgs', error);
      return new InternalServerErrorException();
    }
  }

  async updateUser(id: string, data: Partial<UserRequest>, user: UserPayload) {
    const { userId, role, org } = getUserDetails(user);
    const updateUser = async () => {
      try {
        return await this.prisma.user.update({
          where: {
            id,
          },
          data,
          select: USER_BASIC_DETAILS,
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to update user');
      }
    };
    if (id !== userId) {
      switch (role.name) {
        case 'super-admin': {
          updateUser();
        }
        case 'admin':
          try {
            const userData = await this.prisma.user.findUnique({
              where: {
                id,
              },
              select: {
                id: true,
                orgs: {
                  select: {
                    id: true,
                  },
                },
              },
            });
          } catch (error) {}
        default: {
          throw new ForbiddenException('Not enough permissions to update the user details');
        }
      }
    } else {
      updateUser();
    }
  }

  async deleteUser(id: string, user: UserPayload) {
    const { userId, role, org } = getUserDetails(user);
    let userData;
    try {
      userData = await this.prisma.user.findUnique({
        where: { id },
        select: {
          orgs: {
            select: {
              id: true,
            },
          },
        },
        rejectOnNotFound: true,
      });
    } catch (error) {
      this.logger.error(error);
      if (error?.name === 'NotFoundError') {
        return new NotFoundException();
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
    switch (role.name) {
      case 'super-admin': {
        try {
          return await this.prisma.user.delete({
            where: {
              id,
            },
            select: USER_BASIC_DETAILS,
          });
        } catch (error) {
          throw new InternalServerErrorException('Failed to update user');
        }
      }
      case 'admin': {
        try {
          const userInAdminOrg = userData.orgs.findIndex(({ id }) => org === id) >= 0;
          if (!userInAdminOrg) {
            throw new ForbiddenException('Not enough permissions');
          }
          return await this.prisma.user.delete({
            where: {
              id,
            },
            select: USER_BASIC_DETAILS,
          });
        } catch (error) {
          throw new InternalServerErrorException('Failed to update user');
        }
      }
      default:
        throw new ForbiddenException('Not enough permissions');
    }
  }
}
