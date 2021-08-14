import { DocDates } from './general.interface';
import { Organization } from './organization.interface';

export interface UserBase {
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface User extends UserBase, DocDates {
  id: string;
  password: string;
  org: Organization[];
  blocked: boolean;
  verified: boolean;
}

export interface UserSignupRequest extends UserBase {
  org: string;
  password: string;
}

export interface UserRequest extends UserBase {
  orgId: string;
  password: string;
}

export type UpdateMembersRequestType = 'modify' | 'set';
type ModifyMembers = { type: 'modify'; add?: string[]; remove?: string[] };
type SetMembers = { type: 'set'; set: string[] };
export type UpdateMembersRequest = ModifyMembers | SetMembers; 
