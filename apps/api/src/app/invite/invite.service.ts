import { Roles, UserPayload } from '@compito/api-interfaces';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { getUserDetails } from '../core/utils/payload.util';
import { PrismaService } from '../prisma.service';
import { USER_BASIC_DETAILS } from '../task/task.config';

@Injectable()
export class InviteService {
  logger = new Logger('INVITE');
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
    try {
      const invite = await this.prisma.userInvite.create({
        data: {
          email: data.email,
          orgId: org,
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
      return invite;
    } catch (error) {
      this.logger.error('Failed to create invite', error);
      throw new InternalServerErrorException('Failed to create invite');
    }
  }

  async cancel(id: string, user: UserPayload) {
    const { org, userId, role } = getUserDetails(user);
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
      if (org !== invite.orgId) {
        this.logger.error(`Org doesn't match`);
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
        this.logger.error('Invite not found');
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
        throw new ForbiddenException('No permission to invite user');
      default:
        break;
    }
    try {
      return await this.prisma.userInvite.findMany({
        where: {
          orgId: org,
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
      this.logger.error('Failed to retrieve invites');
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
        this.logger.error('Invite belongs to some other user');
        throw new ForbiddenException('Not allowed');
      }
    } catch (error) {
      if (error?.name === 'NotFoundError') {
        this.logger.error('Invite not found');
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
      this.logger.error('Failed to accept invite', error);
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
        this.logger.error('Invite belongs to some other user');
        throw new ForbiddenException('Not allowed');
      }
    } catch (error) {
      if (error?.name === 'NotFoundError') {
        this.logger.error('Invite not found');
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
