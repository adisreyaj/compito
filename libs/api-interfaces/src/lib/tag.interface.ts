import { Organization } from './organization.interface';

export interface TagBase {
  name: string;
}

export interface Tag extends TagBase {
  id: string;
  org: Organization;
}

export interface TagRequest extends TagBase {
  orgId: string;
}
