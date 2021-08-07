import { Organization } from './organization.interface';

export interface UserBase {
  email: string;
  firstName: string;
  lastName: string;
}

export interface User extends UserBase {
  password: string;
  org: Organization;
}

export interface UserRequest extends UserBase {
  orgId: string;
  password: string;
}
