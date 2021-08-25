import { RequestParams, Role, Roles, UserPayload, UserRequest, UserSignupRequest } from '@compito/api-interfaces';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { AppMetadata, AuthenticationClient, ManagementClient, SignUpUserData, UserMetadata } from 'auth0';
import { compareSync, hashSync } from 'bcrypt';
import * as cuid from 'cuid';
import { JwtPayload, verify } from 'jsonwebtoken';
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

  async getUserDetails(sessionToken: string) {
    try {
      const secret = this.config.get('SESSION_TOKEN_SECRET');
      const token: JwtPayload = verify(sessionToken, secret) as any;
      if (!token) {
        throw new ForbiddenException('Session not valid. Please login again!');
      }
      const [user, userInvite] = await this.prisma.$transaction([
        this.prisma.user.findUnique({
          where: {
            id: token.userId,
          },
          select: {
            email: true,
            orgs: {
              select: {
                id: true,
                name: true,
              },
            },
            projects: {
              select: {
                id: true,
                name: true,
                orgId: true,
              },
            },
            roles: {
              select: {
                orgId: true,
                role: {
                  select: {
                    name: true,
                    label: true,
                    permissions: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.userInvite.findMany({
          where: {
            email: token.email,
          },
          select: {
            id: true,
          },
        }),
      ]);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { orgs = [], projects = [], roles = [] } = user;
      const projectIds = projects.map(({ id }) => id);
      const inviteIds = userInvite.map(({ id }) => id);
      const rolesData = roles.reduce((acc, { role, orgId }) => {
        return {
          ...acc,
          [orgId]: role,
        };
      }, {});

      if (token.org) {
        if (orgs.findIndex(({ id }) => id === token.org) < 0) {
          throw new ForbiddenException('No access to org');
        }
        const projectsPartOfOrg = projects.filter(({ orgId: org }) => org === token.org).map(({ id }) => id);
        const org = orgs.find(({ id }) => id === token.org);
        return {
          org,
          projects: projectsPartOfOrg,
          role: rolesData[token.org],
        };
      }
      return {
        orgs,
        projects: projectIds,
        invites: inviteIds,
        roles: rolesData,
        partOfMultipleOrgs: orgs.length > 1,
        pendingInvites: inviteIds.length > 0,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user orgs');
    }
  }

  async getOnboardingDetails(sessionToken: string) {
    try {
      const secret = this.config.get('SESSION_TOKEN_SECRET');
      if (!secret) {
        throw new Error('Please provide the Session Token Secret');
      }
      const token: JwtPayload = verify(sessionToken, secret) as JwtPayload;
      if (!token) {
        throw new ForbiddenException('Session not valid. Please login again!');
      }
      const [user, userInvite] = await this.prisma.$transaction([
        this.prisma.user.findUnique({
          where: {
            id: token.userId,
          },
          select: {
            ...USER_BASIC_DETAILS,
            orgs: {
              select: {
                id: true,
                name: true,
                createdBy: {
                  select: {
                    firstName: true,
                    lastName: true,
                    image: true,
                    email: true,
                  },
                },
                updatedAt: true,
              },
            },
            roles: {
              select: {
                orgId: true,
                role: {
                  select: {
                    name: true,
                    permissions: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.userInvite.findMany({
          where: {
            email: token.email,
          },
          select: {
            id: true,
            email: true,
            role: {
              select: {
                label: true,
              },
            },
            org: {
              select: {
                id: true,
                name: true,
              },
            },
            invitedBy: {
              select: USER_BASIC_DETAILS,
            },
            createdAt: true,
          },
        }),
      ]);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { orgs = [], ...rest } = user;
      return {
        ...rest,
        orgs,
        invites: userInvite,
      };
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Session expired, Please login again!');
      }
      throw new InternalServerErrorException('Failed to onboard details for user');
    }
  }

  async getUserOrgsAndInvites(userId: string, sessionToken: string) {
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
    const { org, role, userId } = getUserDetails(user);
    let whereCondition: Prisma.UserWhereInput = {};
    switch (role.name) {
      /**
       * 1. Users of the specified Org that are part of projects he/she is a member of
       */
      case 'user':
        {
          let projects = [];
          try {
            const userData = await this.prisma.user.findUnique({
              where: {
                id: userId,
              },
              select: {
                projects: {
                  select: {
                    id: true,
                  },
                },
              },
            });
            projects = userData.projects.map(({ id }) => id);
          } catch (error) {
            this.logger.error('Failed to fetch user details');
            throw new InternalServerErrorException('Failed to fetch users');
          }
          whereCondition = {
            ...whereCondition,
            AND: [
              {
                orgs: {
                  some: {
                    id: org.id,
                  },
                },
              },
              {
                projects: {
                  some: {
                    id: {
                      in: projects,
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
              id: org.id,
            },
          },
        };
        break;
    }
    const { skip, limit } = parseQuery(query);
    try {
      const count$ = this.prisma.user.count({ where: whereCondition });
      const userSelectFields = {
        ...USER_BASIC_DETAILS,
        createdAt: true,
        updatedAt: true,
        roles: {
          where: {
            orgId: org.id,
          },
          select: {
            role: {
              select: {
                id: true,
                label: true,
              },
            },
          },
        },
        orgs: { select: { id: true, name: true } },
      };
      const orgs$ = this.prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: userSelectFields,
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
                    id: org.id,
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
              id: org.id,
            },
          },
        };
        break;
    }
    try {
      const userData = await this.prisma.user.findFirst({
        where: whereCondition,
        select: { ...USER_BASIC_DETAILS, createdAt: true, updatedAt: true, orgs: { select: { id: true, name: true } } },
      });
      if (!userData) {
        throw new NotFoundException('User not found');
      }
      return userData;
    } catch (error) {
      this.logger.error('Failed to fetch orgs', error);
      throw new InternalServerErrorException();
    }
  }

  async updateUser(id: string, data: Partial<UserRequest>, user: UserPayload) {
    const { userId } = getUserDetails(user);
    if (id !== userId) {
      throw new ForbiddenException('Not enough permissions to update the user details');
    }
    const { password, newPassword, orgId, email, roleId, ...rest } = data;
    let dataToUpdate: Prisma.UserUpdateInput = { ...rest };
    if (password !== null && newPassword !== null) {
      if (password === newPassword) {
        throw new BadRequestException('New password cannot be the same as your current password!');
      }
      try {
        const userData = await this.prisma.user.findUnique({
          where: {
            id,
          },
          select: {
            email: true,
            password: true,
          },
        });
        const passwordMatched = compareSync(password, userData.password);
        if (!passwordMatched) {
          this.logger.error(`Current password doesn't match`);
          throw new ForbiddenException(`Current password doesn't match`);
        }
        const passwordUpdatedInAuth0 = this.updateUserPasswordInAuth0(userData.email, newPassword);
        if (passwordUpdatedInAuth0 instanceof Error) {
          throw passwordUpdatedInAuth0;
        }
        dataToUpdate = {
          ...dataToUpdate,
          password: hashSync(newPassword, 10),
        };
      } catch (error) {
        this.logger.error(`USER:PASSWORD`, error);
        throw new InternalServerErrorException('Something went wrong!');
      }
    }
    try {
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: dataToUpdate,
        select: USER_BASIC_DETAILS,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }
  async updateUserRole(id: string, roleId: string, user: UserPayload) {
    const { role, org } = getUserDetails(user);
    let userData;
    switch (role.name as Roles) {
      case 'super-admin':
      case 'org-admin':
      case 'admin': {
        try {
          userData = await this.prisma.user.findUnique({
            where: { id },
            select: {
              orgs: {
                select: {
                  id: true,
                },
              },
              roles: {
                where: {
                  orgId: org.id,
                },
              },
            },
            rejectOnNotFound: true,
          });

          if (userData.orgs.findIndex(({ id }) => id === org.id) < 0) {
            throw new ForbiddenException('Not enough permissions to update the role');
          }
          if (userData.roles?.length === 0) {
            this.logger.error(`User doesn't have proper roles configured`);
            throw new InternalServerErrorException();
          }
        } catch (error) {
          if (error?.name === 'NotFoundError') {
            this.logger.error('Invite not found');
            throw new NotFoundException('Invite not found');
          }
          throw new InternalServerErrorException();
        }
        break;
      }
      default:
        this.logger.error(`Role doesn't have authority to update user role`);
        throw new ForbiddenException('Not enough permissions to update the user details');
    }
    try {
      const userSelectFields = {
        ...USER_BASIC_DETAILS,
        createdAt: true,
        updatedAt: true,
        roles: {
          where: {
            orgId: org.id,
          },
          select: {
            role: {
              select: {
                id: true,
                label: true,
              },
            },
          },
        },
        orgs: { select: { id: true, name: true } },
      };
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          roles: {
            update: {
              where: {
                id: userData.roles[0].id,
              },
              data: {
                roleId: roleId,
              },
            },
          },
        },
        select: userSelectFields,
      });
    } catch (error) {
      this.logger.error('Failed to update role', error);
      throw new InternalServerErrorException('Failed to update role');
    }
  }

  async deleteUser(id: string, user: UserPayload) {
    const { role, org } = getUserDetails(user);
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
        throw new NotFoundException();
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

  private updateUserPasswordInAuth0 = async (email: string, password: string) => {
    try {
      const user = await this.managementClient.getUsersByEmail(email);
      const connection = this.config.get('AUTH0_DB');
      if (user?.length > 0) {
        const userId = user[0].user_id;
        await this.managementClient.updateUser(
          {
            id: userId,
          },
          {
            password,
            connection,
          },
        );
        return true;
      } else {
        return new BadRequestException('User not found');
      }
    } catch (error) {
      return new InternalServerErrorException();
    }
  };
}
