import { TaskRequest } from '@compito/api-interfaces';

export namespace BoardsAction {
  export class Get {
    static readonly type = '[Boards] Get board';
    constructor(public payload: string) {}
  }
  export class AddTask {
    static readonly type = '[Task] Add Task';
    constructor(public payload: TaskRequest) {}
  }
}
