import { DocDates } from './general.interface';
import { User } from './user.interface';

export interface CommentBase {
  content: string;
}

export interface Comment extends CommentBase, DocDates {
  createdBy: User;
}

export interface CommentRequest extends CommentBase {
  createdById: string;
}
