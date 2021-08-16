import { NonFunctionKeys } from 'utility-types';

export const ROLE_LEVEL = {
  user: 1,
  'project-admin': 2,
  'org-admin': 3,
  admin: 4,
  'super-admin': 5,
};

export type Roles = NonFunctionKeys<typeof ROLE_LEVEL>;
