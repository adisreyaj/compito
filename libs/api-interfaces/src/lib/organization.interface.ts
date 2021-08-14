import { DocDates } from './general.interface';
import { Project } from './project.interface';
import { User } from './user.interface';

export interface OrganizationBase {
  name: string;
  slug: string;
}

export interface Organization extends OrganizationBase, DocDates {
  id: string;
  members: User[];
  projects: Project[];
}
export interface OrganizationRequest extends OrganizationBase {}
