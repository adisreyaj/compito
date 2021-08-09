import { ProjectRequest } from '@compito/api-interfaces';

export namespace ProjectsAction {
  export class Add {
    static readonly type = '[Projects] Add item';
    constructor(public payload: ProjectRequest) {}
  }
}
