import { Organization } from './organization.interface';
import { Project } from './project.interface';
import { Task } from './task.interface';
import { User } from './user.interface';

export interface BoardBase {
  name: string;
}
export interface Board extends BoardBase {
  id: string;
  org: Organization;
  project: Project;
  createdBy: User;
  tasks: Task[];
}

export interface BoardRequest extends BoardBase {
  orgId: string;
  projectId: string;
  createdById: string;
}
