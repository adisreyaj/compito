import { NonFunctionKeys } from 'utility-types';

export const ROLE_LEVEL = {
  user: 1,
  'project-admin': 2,
  'org-admin': 3,
  'super-admin': 4,
};

export type Roles = NonFunctionKeys<typeof ROLE_LEVEL>;
