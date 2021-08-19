import { Injectable } from '@angular/core';
import { DataLoading, DataLoadingState, Task } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { TasksActions } from './tasks.actions';

export class TasksStateModel {
  public tasks: Task[] = [];
  public tasksFetched = false;
  public tasksLoading: DataLoading = { type: DataLoadingState.init };
}

const defaults: TasksStateModel = {
  tasks: [],
  tasksFetched: false,
  tasksLoading: { type: DataLoadingState.init },
};

@State<TasksStateModel>({
  name: 'tasks',
  defaults,
})
@Injectable()
export class TasksState {
  @Selector()
  static getMyTasks(state: TasksStateModel) {
    return state.tasks;
  }
  @Selector()
  static tasksFetched(state: TasksStateModel) {
    return state.tasksFetched;
  }
  @Selector()
  static tasksLoading(state: TasksStateModel) {
    return state.tasksLoading;
  }

  constructor(private taskService: TasksService) {}
  @Action(TasksActions.GetMyTasks)
  add({ patchState }: StateContext<TasksStateModel>) {
    patchState({
      tasksLoading: { type: DataLoadingState.loading },
    });
    return this.taskService.getMyTasks().pipe(
      tap(
        ({ payload: tasks }) => {
          patchState({
            tasks,
            tasksLoading: { type: DataLoadingState.success },
            tasksFetched: true,
          });
        },
        () => {
          patchState({
            tasksLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }
}
