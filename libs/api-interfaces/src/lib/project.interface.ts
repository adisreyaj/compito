import { Organization } from './organization.interface';
import { User } from './user.interface';

export interface ProjectBase {
  name: string;
  slug: string;
}
export interface Project extends ProjectBase {
  id: string;
  org: Organization;
  createdBy: User;
}

export interface ProjectRequest extends ProjectBase {
  orgId: string;
  createdById: string;
}
