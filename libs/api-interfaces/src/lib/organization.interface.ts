export interface OrganizationBase {
  name: string;
  slug: string;
}

export interface Organization extends OrganizationBase {}
export interface OrganizationRequest extends OrganizationBase {}
