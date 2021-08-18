// TODD: Move this to common place
import { NonFunctionKeys } from 'utility-types';

export const ROLE_LEVEL = {
  user: 1,
  'project-admin': 2,
  'org-admin': 3,
  admin: 4,
  'super-admin': 5,
};

export type Roles = NonFunctionKeys<typeof ROLE_LEVEL>;

export interface Role {
  id: string;
  name: Roles | string;
  label: string;
  permissions: any;
}
