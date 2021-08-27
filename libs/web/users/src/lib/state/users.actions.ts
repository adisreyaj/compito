import { InviteRequest, UserRequest } from '@compito/api-interfaces';
export namespace UsersAction {
  export class GetInvites {
    static readonly type = '[Users] Get Invites';
  }

  export class RemoveUser {
    static readonly type = '[Users] Remove User';
    constructor(public id: string) {}
  }
  export class InviteUser {
    static readonly type = '[Users] Invite User';
    constructor(public payload: InviteRequest) {}
  }
  export class UpdateUser {
    static readonly type = '[Users] Update User';
    constructor(public id: string, public payload: Partial<UserRequest>) {}
  }
  export class UpdateUserRole {
    static readonly type = '[Users] Update User Role';
    constructor(public id: string, public roleId: string) {}
  }
  export class GetRoles {
    static readonly type = '[Users] Get roles';
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
