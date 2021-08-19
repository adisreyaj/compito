import { UserRequest } from '@compito/api-interfaces';
export namespace UsersAction {
  export class Add {
    static readonly type = '[Users] Add item';
    constructor(public payload: UserRequest) {}
  }
  export class GetRoles {
    static readonly type = '[Users] Get roles';
    constructor() {}
  }
  export class GetAll {
    static readonly type = '[Users] Fetch All';
    constructor(public payload: any) {}
  }
}
