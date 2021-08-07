import { Organization } from './organization.interface';
import { Project } from './project.interface';
import { TagBase } from './tag.interface';

export interface TaskBase {
  title: string;
}

export interface Task extends TaskBase {
  id: string;
  project: Project;
  org: Organization;
}

export interface TaskRequest extends TagBase {
  projectId: string;
  orgId: string;
}
