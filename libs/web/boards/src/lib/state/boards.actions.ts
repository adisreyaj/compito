import { BoardList, TaskRequest } from '@compito/api-interfaces';

export namespace BoardsAction {
  export class Get {
    static readonly type = '[Boards] Get board';
    constructor(public payload: string) {}
  }
  export class AddTask {
    static readonly type = '[Task] Add Task';
    constructor(public payload: TaskRequest) {}
  }

  export class UpdateAssignees {
    static readonly type = '[Task] Update assignees';
    constructor(public taskId: string, public assignees: string[]) {}
  }
  
  export class Reorder {
    static readonly type = '[Task] Reorder task';
    constructor(public id: string, public newList: BoardList[]) {}
  }
  export class MoveTaskWithList {
    static readonly type = '[Task] Reorder task';
    constructor(public listId: string, public prevIndex: number, public currIndex: number) {}
  }
  export class MoveTaskToOtherList {
    static readonly type = '[Task] Move task';
    constructor(
      public from: string,
      public to: string,
      public prevIndex: number,
      public currIndex: number,
      public taskId: string,
    ) {}
  }
}
