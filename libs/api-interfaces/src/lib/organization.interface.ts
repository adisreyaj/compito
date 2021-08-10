export interface OrganizationBase {
  name: string;
  slug: string;
}

export interface Organization extends OrganizationBase {
  id: string;
}
export interface OrganizationRequest extends OrganizationBase {}
