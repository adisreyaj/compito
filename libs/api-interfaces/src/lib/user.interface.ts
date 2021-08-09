import { Organization } from './organization.interface';

export interface UserBase {
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface User extends UserBase {
  password: string;
  org: Organization;
  blocked: boolean;
  verified: boolean;
}

export interface UserRequest extends UserBase {
  orgId: string;
  password: string;
}
