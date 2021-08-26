import { OrganizationRequest, UpdateMembersRequest } from '@compito/api-interfaces';

export namespace OrgsAction {
  export class Add {
    static readonly type = '[Orgs] Add org';
    constructor(public payload: OrganizationRequest) {}
  }

  export class Update {
    static readonly type = '[Orgs] Update Org';
    constructor(public id: string, public payload: OrganizationRequest) {}
  }
  export class Delete {
    static readonly type = '[Orgs] Delete Org';
    constructor(public id: string) {}
  }
  export class GetAll {
    static readonly type = '[Orgs] Get All';
  }

  export class UpdateMembers {
    static readonly type = '[Orgs] Update members';
    constructor(public id: string, public payload: UpdateMembersRequest) {}
  }
  export class Get {
    static readonly type = '[Orgs] Get org';
    constructor(public id: string) {}
  }
}
