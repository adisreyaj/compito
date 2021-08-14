import { UpdateMembersRequest } from '@compito/api-interfaces';

export namespace OrgsAction {
  export class GetAll {
    static readonly type = '[Orgs] Get All';
    constructor() {}
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
