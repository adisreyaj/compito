import { BoardRequest, ProjectRequest, UpdateProjectMembersRequest } from '@compito/api-interfaces';

export namespace ProjectsAction {
  export class Add {
    static readonly type = '[Projects] Add project';
    constructor(public payload: ProjectRequest) {}
  }
  export class AddBoard {
    static readonly type = '[Projects] Add board to project';
    constructor(public payload: BoardRequest) {}
  }
  export class UpdateMembers {
    static readonly type = '[Projects] Update members';
    constructor(public id: string, public payload: UpdateProjectMembersRequest) {}
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
