export namespace HomeAction {
  export class GetProjects {
    static readonly type = '[Home] Get projects';
  }
  export class GetBoards {
    static readonly type = '[Home] Get boards';
  }
  export class GetRecentTasks {
    static readonly type = '[Home] Get recent tasks';
  }
  export class GetHighPriorityTasks {
    static readonly type = '[Home] Get high priority tasks';
  }
}
