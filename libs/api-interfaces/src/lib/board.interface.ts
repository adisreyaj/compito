import { DocDates } from './general.interface';
import { Organization } from './organization.interface';
import { Project } from './project.interface';
import { Task } from './task.interface';
import { User } from './user.interface';

export interface BoardBase {
  name: string;
  lists: BoardList[];
  description: string;
}
export interface Board extends BoardBase, DocDates {
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

export interface BoardList {
  id: string;
  name: string;
}

export interface BoardListWithTasks extends BoardList {
  tasks: Task[];
}

export interface BoardListTasksGrouped {
  [key: string]: Task[];
}
