import { Injectable } from '@angular/core';
import { Board, DataLoading, DataLoadingState, Project, Task } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { HomeService } from '../home.service';
import { HomeAction } from './home.actions';

export class HomeStateModel {
  public recentTasks: Task[] = [];
  public highPriorityTasks: Task[] = [];
  public projects: Project[] = [];
  public boards: Board[] = [];
  public recentTasksLoading: DataLoading = { type: DataLoadingState.init };
  public highPriorityTasksLoading: DataLoading = { type: DataLoadingState.init };
  public projectsLoading: DataLoading = { type: DataLoadingState.init };
  public boardsLoading: DataLoading = { type: DataLoadingState.init };
  public recentTasksFetched = false;
  public highPriorityTasksFetched = false;
  public projectsFetched = false;
  public boardsFetched = false;
}

const defaults: HomeStateModel = {
  recentTasks: [],
  highPriorityTasks: [],
  boards: [],
  projects: [],
  recentTasksLoading: { type: DataLoadingState.init },
  highPriorityTasksLoading: { type: DataLoadingState.init },
  projectsLoading: { type: DataLoadingState.init },
  boardsLoading: { type: DataLoadingState.init },
  recentTasksFetched: false,
  highPriorityTasksFetched: false,
  projectsFetched: false,
  boardsFetched: false,
};

@State<HomeStateModel>({
  name: 'home',
  defaults,
})
@Injectable()
export class HomeState {
  @Selector()
  static projectsLoading(state: HomeStateModel) {
    if (state.projectsFetched && state.projectsLoading.type !== DataLoadingState.error) {
      return { type: DataLoadingState.success };
    }
    return state.projectsLoading;
  }
  @Selector()
  static boardsLoading(state: HomeStateModel) {
    if (state.boardsFetched && state.boardsLoading.type !== DataLoadingState.error) {
      return { type: DataLoadingState.success };
    }
    return state.boardsLoading;
  }
  @Selector()
  static recentTasksLoading(state: HomeStateModel) {
    if (state.recentTasksFetched && state.recentTasksLoading.type !== DataLoadingState.error) {
      return { type: DataLoadingState.success };
    }
    return state.recentTasksLoading;
  }

  @Selector()
  static highPriorityTasksLoading(state: HomeStateModel) {
    if (state.highPriorityTasksFetched && state.projectsLoading.type !== DataLoadingState.error) {
      return { type: DataLoadingState.success };
    }
    return state.highPriorityTasksLoading;
  }

  @Selector()
  static getProjects(state: HomeStateModel) {
    return state.projects;
  }
  @Selector()
  static getBoards(state: HomeStateModel) {
    return state.boards;
  }
  @Selector()
  static getRecentTasks(state: HomeStateModel) {
    return state.recentTasks;
  }
  @Selector()
  static getHighPriorityTasks(state: HomeStateModel) {
    return state.highPriorityTasks;
  }

  constructor(private homeService: HomeService) {}
  @Action(HomeAction.GetProjects)
  getProjects({ patchState }: StateContext<HomeStateModel>) {
    patchState({
      projectsLoading: { type: DataLoadingState.loading },
    });
    return this.homeService.getProjects().pipe(
      tap(
        (data) => {
          patchState({
            projects: data.payload,
            projectsLoading: { type: DataLoadingState.success },
            projectsFetched: true,
          });
        },
        () => {
          patchState({
            projectsLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }
  @Action(HomeAction.GetBoards)
  getBoards({ patchState }: StateContext<HomeStateModel>) {
    patchState({
      boardsLoading: { type: DataLoadingState.loading },
    });
    return this.homeService.getBoards().pipe(
      tap(
        (data) => {
          patchState({
            boards: data.payload,
            boardsLoading: { type: DataLoadingState.success },
            boardsFetched: true,
          });
        },
        () => {
          patchState({
            boardsLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }

  @Action(HomeAction.GetRecentTasks)
  getRecentTasks({ patchState }: StateContext<HomeStateModel>) {
    patchState({
      recentTasksLoading: { type: DataLoadingState.loading },
    });
    return this.homeService.getRecentTasks().pipe(
      tap(
        (data) => {
          patchState({
            recentTasks: data.payload,
            recentTasksLoading: { type: DataLoadingState.success },
            recentTasksFetched: true,
          });
        },
        () => {
          patchState({
            recentTasksLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }

  @Action(HomeAction.GetProjects)
  getHighPriorityTasks({ patchState }: StateContext<HomeStateModel>) {
    patchState({
      highPriorityTasksLoading: { type: DataLoadingState.loading },
    });
    return this.homeService.getHighPriorityTasks().pipe(
      tap(
        (data) => {
          patchState({
            highPriorityTasks: data.payload,
            highPriorityTasksLoading: { type: DataLoadingState.success },
            highPriorityTasksFetched: true,
          });
        },
        () => {
          patchState({
            highPriorityTasksLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }
}
