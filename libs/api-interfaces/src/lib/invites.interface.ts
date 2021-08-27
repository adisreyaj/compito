import { Organization } from '@prisma/client';
import { Role } from './role.interface';
import { User } from './user.interface';

export interface Invite {
  id: string;
  email: string;
  role: Role;
  invitedBy: User;
  org: Organization;
  createdAt: Date;
}
