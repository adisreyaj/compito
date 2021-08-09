import { UserRequest } from '@compito/api-interfaces';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppMetadata, ManagementClient, UserMetadata } from 'auth0';
import { PrismaService } from '../prisma.service';
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
    let user: any | null = null;
    const connection = this.config.get('AUTH0_DB');
    if (!connection) {
      throw new Error('Please provide the auth DB name');
    }
    try {
      const { orgId, ...rest } = data;
      user = await this.prisma.user.create({
        data: {
          ...rest,
          orgId,
        },
      });
      this.logger.debug('User created successfully!' + user.id);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
    try {
      if (user) {
        const { email, firstName, lastName, password, orgId } = data;
        await this.auth0.createUser({
          connection,
          email,
          user_metadata: {
            org: orgId,
          },
          blocked: false,
          app_metadata: {},
          given_name: firstName,
          family_name: lastName,
          user_id: user.id,
          password,
        });
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
}
