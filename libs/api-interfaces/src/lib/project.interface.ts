import { Organization } from './organization.interface';

export interface ProjectBase {
  name: string;
}
export interface Project extends ProjectBase {
  id: string;
  org: Organization;
  orgId: string;
}

export interface ProjectRequest extends ProjectBase {
  orgId: string;
}
