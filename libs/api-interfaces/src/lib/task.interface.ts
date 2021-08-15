import { DocDates } from './general.interface';
import { Organization } from './organization.interface';
import { Priority } from './priority.interface';
import { Project } from './project.interface';
import { Tag } from './tag.interface';
import { User } from './user.interface';

export interface TaskBase {
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  list: string;
}

export interface Task extends TaskBase, DocDates {
  id: string;
  project: Project;
  org: Organization;
  board: any;
  assignedBy: User;
  assignees: User[];
  tags: Tag[];
  createdBy: User;
  comments: any[];
  subTasks: any[];
}

export interface TaskRequest extends TaskBase {
  projectId: string;
  boardId: string;
  orgId: string;
  assignedById: string;
  assignees: string[];
  tags: string[];
  createdById: string;
}
