import { Injectable } from '@angular/core';
import { Board, Project, Task } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { HomeService } from '../home.service';
import { HomeAction } from './home.actions';

export class HomeStateModel {
  public recentlyAddedTasks: Task[] = [];
  public highPriorityTasks: Task[] = [];
  public projects: Project[] = [];
  public boards: Board[] = [];
}

const defaults: HomeStateModel = {
  recentlyAddedTasks: [],
  highPriorityTasks: [],
  boards: [],
  projects: [],
};

@State<HomeStateModel>({
  name: 'home',
  defaults,
})
@Injectable()
export class HomeState {
  @Selector()
  static getProjects(state: HomeStateModel) {
    return state.projects;
  }
  @Selector()
  static getRecentTasks(state: HomeStateModel) {
    return state.recentlyAddedTasks;
  }
  @Selector()
  static getHighPriorityTasks(state: HomeStateModel) {
    return state.highPriorityTasks;
  }

  constructor(private homeService: HomeService) {}
  @Action(HomeAction.GetProjects)
  getProjects({ patchState }: StateContext<HomeStateModel>) {
    return this.homeService.getProjects().pipe(
      tap((data) => {
        patchState({
          projects: data.payload,
        });
      }),
    );
  }

  @Action(HomeAction.GetRecentTasks)
  getRecentTasks({ patchState }: StateContext<HomeStateModel>) {
    return this.homeService.getRecentTasks().pipe(
      tap((data) => {
        patchState({
          recentlyAddedTasks: data.payload,
        });
      }),
    );
  }

  @Action(HomeAction.GetProjects)
  getHighPriorityTasks({ patchState }: StateContext<HomeStateModel>) {
    return this.homeService.getHighPriorityTasks().pipe(
      tap((data) => {
        patchState({
          highPriorityTasks: data.payload,
        });
      }),
    );
  }
}
