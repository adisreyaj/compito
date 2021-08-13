import { Injectable } from '@angular/core';
import { Task } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { TasksActions } from './tasks.actions';

export class TasksStateModel {
  public tasks: Task[] = [];
}

const defaults: TasksStateModel = {
  tasks: [],
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

  constructor(private taskService: TasksService) {}
  @Action(TasksActions.GetMyTasks)
  add({ patchState }: StateContext<TasksStateModel>) {
    return this.taskService.getMyTasks().pipe(
      tap(({ payload: tasks }) => {
        patchState({
          tasks,
        });
      }),
    );
  }
}
