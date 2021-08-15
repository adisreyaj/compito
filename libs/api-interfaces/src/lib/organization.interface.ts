import { DocDates } from './general.interface';

export interface OrganizationBase {
  name: string;
  slug: string;
}

export interface Organization extends OrganizationBase, DocDates {
  id: string;
}
export interface OrganizationRequest extends OrganizationBase {}
