import { UserPayload } from '@compito/api-interfaces';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { getUserDetails } from '../core/utils/payload.util';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RoleService {
  private logger = new Logger('ROLES');

  constructor(private prisma: PrismaService) {}
  async getRoles(user: UserPayload) {
    const { role } = getUserDetails(user);
    try {
      const roles = await this.prisma.role.findMany({
        select: {
          id: true,
          label: true,
          name: true,
        },
      });

      if (role.name === 'super-admin') {
        return roles;
      }
      return roles.filter(({ name }) => name !== 'super-admin');
    } catch (error) {
      this.logger.error('Failed to fetch roles', error);
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }
}
