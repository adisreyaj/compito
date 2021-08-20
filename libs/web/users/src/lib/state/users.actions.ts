import { InviteRequest } from '@compito/api-interfaces';
export namespace UsersAction {
  export class GetInvites {
    static readonly type = '[Users] Get Invites';
    constructor() {}
  }

  export class InviteUser {
    static readonly type = '[Users] Invite User';
    constructor(public payload: InviteRequest) {}
  }
  export class GetRoles {
    static readonly type = '[Users] Get roles';
    constructor() {}
  }
  export class GetAll {
    static readonly type = '[Users] Fetch All';
    constructor(public payload: any) {}
  }

  export class CancelInvite {
    static readonly type = '[Users] Cancel invite';
    constructor(public id: string) {}
  }
}
