import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RoleService {
  private logger = new Logger('ROLES');

  constructor(private prisma: PrismaService) {}
  async getRoles() {
    try {
      const roles = await this.prisma.role.findMany({
        select: {
          id: true,
          label: true,
          name: true,
        },
      });
      return roles.filter(({ name }) => name !== 'super-admin');
    } catch (error) {
      this.logger.error('Failed to fetch roles', error);
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }
}
