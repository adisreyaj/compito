import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppMetadata, AuthenticationClient, ManagementClient, UserMetadata } from 'auth0';

@Injectable()
export class AuthService {
  management: ManagementClient<AppMetadata, UserMetadata>;
  auth: AuthenticationClient;
  constructor(private config: ConfigService) {
    this.management = new ManagementClient({
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
      token: this.config.get('AUTH0_MANAGEMENT_TOKEN'),
      // clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
    });
    this.auth = new AuthenticationClient({
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
      clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
    });
  }
}
