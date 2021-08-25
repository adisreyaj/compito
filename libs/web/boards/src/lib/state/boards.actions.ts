import { BoardList, TaskRequest } from '@compito/api-interfaces';

export namespace BoardsAction {
  export class Get {
    static readonly type = '[Boards] Get board';
    constructor(public payload: string) {}
  }
  export class GetPriorities {
    static readonly type = '[Boards] Get priorities';
  }
  export class AddList {
    static readonly type = '[Boards] Add List';
    constructor(public boardId: string, public name: string) {}
  }
  export class AddTask {
    static readonly type = '[Task] Add Task';
    constructor(public payload: TaskRequest) {}
  }

  export class UpdateAssignees {
    static readonly type = '[Task] Update assignees';
    constructor(public listId: string, public taskId: string, public assignees: string[]) {}
  }

  export class UpdateTaskDescription {
    static readonly type = '[Task] Update task description';
    constructor(public taskId: string, public description: string, public listId: string) {}
  }
  export class UpdateTaskTitle {
    static readonly type = '[Task] Update task title';
    constructor(public taskId: string, public title: string, public listId: string) {}
  }
  export class AddComment {
    static readonly type = '[Task] Add comment';
    constructor(public taskId: string, public listId: string, public content: string) {}
  }
  export class UpdateTaskPriority {
    static readonly type = '[Task] Update task priority';
    constructor(public taskId: string, public priority: string, public listId: string) {}
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
