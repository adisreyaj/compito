import { Roles, UserPayload } from '@compito/api-interfaces';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CompitoLogger } from '../core/utils/logger.util';
import { getUserDetails } from '../core/utils/payload.util';
import { PrismaService } from '../prisma.service';
import { USER_BASIC_DETAILS } from '../task/task.config';

@Injectable()
export class InviteService {
  logger = new CompitoLogger('INVITE');
  constructor(private prisma: PrismaService) {}
  async invite(data: { email: string; role: string }, user: UserPayload) {
    const { org, userId, role } = getUserDetails(user);
    switch (role.name as Roles) {
      case 'user':
      case 'project-admin':
        throw new ForbiddenException('No permission to invite user');
      default:
        break;
    }
    let userWithEmail;
    try {
      userWithEmail = await this.prisma.user.findFirst({
        where: {
          email: data.email,
          orgs: {
            some: {
              id: {
                in: [org.id],
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('invite', 'Failed get user details', error);
      throw new InternalServerErrorException('Failed to invite user');
    }
    if (userWithEmail) {
      this.logger.error('invite', 'User already part of the org');
      throw new BadRequestException('User already part of the org');
    }
    try {
      return await this.prisma.userInvite.create({
        data: {
          email: data.email,
          orgId: org.id,
          invitedById: userId,
          roleId: data.role,
        },
        select: {
          id: true,
          email: true,
          org: {
            select: {
              id: true,
              name: true,
            },
          },
          invitedBy: {
            select: USER_BASIC_DETAILS,
          },
          role: {
            select: {
              label: true,
              id: true,
            },
          },
          createdAt: true,
        },
      });
    } catch (error) {
      this.logger.error('invite', 'Failed to create invite', error);
      throw new InternalServerErrorException('Failed to create invite');
    }
  }

  async cancel(id: string, user: UserPayload) {
    const { org, role } = getUserDetails(user);
    switch (role.name as Roles) {
      case 'user':
      case 'project-admin':
        throw new ForbiddenException('No permission to invite user');
      default:
        break;
    }
    try {
      const invite = await this.prisma.userInvite.findUnique({
        where: { id },
        select: {
          orgId: true,
        },
        rejectOnNotFound: true,
      });
      if (org.id !== invite.orgId) {
        this.logger.error('cancelInvite', `Org doesn't match`);
        throw new ForbiddenException('No permission to revoke invite');
      }
      await this.prisma.userInvite.delete({
        where: {
          id,
        },
      });
      return { message: 'Invite revoked successfully!' };
    } catch (error) {
      if (error?.name === 'NotFoundError') {
        this.logger.error('cancelInvite', 'Invite not found');
        throw new NotFoundException('Invite not found');
      }
      this.logger.error('Failed to revoke the invite', error);
      throw new InternalServerErrorException('Failed to revoke the invite');
    }
  }
  async getInvites(user: UserPayload) {
    const { org, role } = getUserDetails(user);
    switch (role.name as Roles) {
      case 'user':
      case 'project-admin':
        this.logger.error('getInvites', 'No permission to view invites');

        throw new ForbiddenException('No permission to invite user');
      default:
        break;
    }
    try {
      return await this.prisma.userInvite.findMany({
        where: {
          orgId: org.id,
        },
        select: {
          id: true,
          createdAt: true,
          email: true,
          role: {
            select: {
              id: true,
              label: true,
            },
          },
          invitedBy: {
            select: USER_BASIC_DETAILS,
          },
        },
      });
    } catch (error) {
      this.logger.error('getInvites', 'Failed to retrieve invites', error);
      throw new InternalServerErrorException('Failed to retrieve invites');
    }
  }

  async accept(id: string, userId: string, email: string) {
    let invite;
    try {
      invite = await this.prisma.userInvite.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          orgId: true,
          roleId: true,
        },
        rejectOnNotFound: true,
      });
      if (email !== invite.email) {
        this.logger.error('acceptInvite', 'Invite belongs to some other user');
        throw new ForbiddenException('Not allowed');
      }
    } catch (error) {
      if (error?.name === 'NotFoundError') {
        this.logger.error('acceptInvite', 'Invite not found', error);
        throw new NotFoundException('Invite not valid');
      }
    }
    try {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            orgs: {
              connect: {
                id: invite.orgId,
              },
            },
            roles: {
              create: {
                org: {
                  connect: {
                    id: invite.orgId,
                  },
                },
                role: {
                  connect: {
                    id: invite.roleId,
                  },
                },
              },
            },
          },
        }),
        this.prisma.userInvite.delete({
          where: {
            id,
          },
        }),
      ]);
      return { message: 'Invite accepted!' };
    } catch (error) {
      this.logger.error('acceptInvite', 'Failed to accept invite', error);
      throw new InternalServerErrorException('Failed to accept invite');
    }
  }

  async reject(id: string, userId: string, email: string) {
    let invite;
    try {
      invite = await this.prisma.userInvite.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          orgId: true,
          role: {
            select: {
              id: true,
            },
          },
        },
        rejectOnNotFound: true,
      });
      if (email !== invite.email) {
        this.logger.error('rejectInvite', 'Invite belongs to some other user');
        throw new ForbiddenException('Not allowed');
      }
    } catch (error) {
      if (error?.name === 'NotFoundError') {
        this.logger.error('rejectInvite', 'Invite not found', error);
        throw new NotFoundException('Invite not valid');
      }
    }
    try {
      await this.prisma.userInvite.delete({
        where: {
          id,
        },
      });
      return { message: 'Invite rejected!' };
    } catch (error) {
      this.logger.error('Failed to reject invite', error);
      throw new InternalServerErrorException('Failed to reject invite');
    }
  }
}
