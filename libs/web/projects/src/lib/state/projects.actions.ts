import { ProjectRequest } from '@compito/api-interfaces';

export namespace ProjectsAction {
  export class Add {
    static readonly type = '[Projects] Add project';
    constructor(public payload: ProjectRequest) {}
  }
  export class GetAll {
    static readonly type = '[Projects] Get projects';
    constructor(public payload: any) {}
  }
}
