import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppMetadata, ManagementClient, UserMetadata } from 'auth0';
@Injectable()
export class UserService {
  auth0: ManagementClient<AppMetadata, UserMetadata>;
  constructor(private config: ConfigService) {
    this.auth0 = new ManagementClient({
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
      clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
    });
  }

  async addUser() {
    try {
      const result = await this.auth0.createUser({
        connection: 'compito-users',
        email: 'john.doe@gmail.com',
        user_metadata: {
          org: 'compito-org',
        },
        blocked: false,
        app_metadata: {},
        given_name: 'John',
        family_name: 'Doe',
        user_id: 'abc',
        password: 'J0hn@123',
      });
      Logger.debug(result);
      return result;
    } catch (error) {
      console.error(error);
      return new InternalServerErrorException(error.message);
    }
  }
}
