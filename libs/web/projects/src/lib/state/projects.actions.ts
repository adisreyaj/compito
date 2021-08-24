import { BoardRequest, ProjectRequest, UpdateMembersRequest } from '@compito/api-interfaces';

export namespace ProjectsAction {
  export class Add {
    static readonly type = '[Projects] Add project';
    constructor(public payload: ProjectRequest) {}
  }
  export class Update {
    static readonly type = '[Projects] Update project';
    constructor(public id: string, public payload: ProjectRequest) {}
  }
  export class Delete {
    static readonly type = '[Projects] Delete project';
    constructor(public id: string) {}
  }
  export class AddBoard {
    static readonly type = '[Projects] Add board to project';
    constructor(public payload: BoardRequest) {}
  }
  export class UpdateBoard {
    static readonly type = '[Projects] Update a board';
    constructor(public id: string, public payload: BoardRequest) {}
  }
  export class UpdateMembers {
    static readonly type = '[Projects] Update members';
    constructor(public id: string, public payload: UpdateMembersRequest) {}
  }
  export class GetAll {
    static readonly type = '[Projects] Get projects';
    constructor(public payload: any) {}
  }
  export class Get {
    static readonly type = '[Projects] Get project';
    constructor(public payload: string) {}
  }
}
