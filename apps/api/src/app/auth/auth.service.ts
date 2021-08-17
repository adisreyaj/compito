import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppMetadata, AuthenticationClient, ManagementClient, ManagementClientOptions, UserMetadata } from 'auth0';

@Injectable()
export class AuthService {
  management: ManagementClient<AppMetadata, UserMetadata>;
  auth: AuthenticationClient;
  constructor(private config: ConfigService) {
    let managementOptions: ManagementClientOptions = {
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
    };
    if (this.config.get('NODE_ENV') === 'production') {
      managementOptions = {
        ...managementOptions,
        clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
      };
    } else {
      managementOptions = {
        ...managementOptions,
        token: this.config.get('AUTH0_MANAGEMENT_TOKEN'),
      };
    }
    this.management = new ManagementClient(managementOptions);
    this.auth = new AuthenticationClient({
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
      clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
    });
  }
}
