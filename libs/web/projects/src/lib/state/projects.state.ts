import { Injectable } from '@angular/core';
import { Project } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch } from '@ngxs/store/operators';
import produce from 'immer';
import { tap } from 'rxjs/operators';
import { ProjectsService } from '../projects.service';
import { ProjectsAction } from './projects.actions';
export class ProjectsStateModel {
  public projects: Project[] = [];
  public projectDetail: Project | null = null;
}

const defaults: ProjectsStateModel = {
  projects: [],
  projectDetail: null,
};

@State<ProjectsStateModel>({
  name: 'projects',
  defaults,
})
@Injectable()
export class ProjectsState {
  @Selector()
  static getAllProjects(state: ProjectsStateModel) {
    return state.projects;
  }
  @Selector()
  static getProjectDetail(state: ProjectsStateModel) {
    return state.projectDetail;
  }
  constructor(private projectService: ProjectsService) {}
  @Action(ProjectsAction.Add)
  add({ setState }: StateContext<ProjectsStateModel>, { payload }: ProjectsAction.Add) {
    return this.projectService.create(payload).pipe(
      tap((project) => {
        setState(patch({ projects: append([project]) }));
      }),
    );
  }
  @Action(ProjectsAction.AddBoard)
  addBoard({ patchState, getState }: StateContext<ProjectsStateModel>, { payload }: ProjectsAction.AddBoard) {
    return this.projectService.createBoard(payload).pipe(
      tap((data) => {
        const { projectDetail } = getState();
        const projectDetailUpdated = produce(projectDetail, (draft) => {
          draft?.boards.push(data);
        });
        patchState({ projectDetail: projectDetailUpdated });
      }),
    );
  }

  @Action(ProjectsAction.GetAll)
  getAll({ patchState }: StateContext<ProjectsStateModel>, { payload }: ProjectsAction.GetAll) {
    return this.projectService.getAll().pipe(
      tap(({ payload: projects }) => {
        patchState({ projects });
      }),
    );
  }
  @Action(ProjectsAction.Get)
  get({ patchState }: StateContext<ProjectsStateModel>, { payload }: ProjectsAction.Get) {
    return this.projectService.getSingle(payload).pipe(
      tap((data) => {
        patchState({ projectDetail: data });
      }),
    );
  }
  @Action(ProjectsAction.UpdateMembers)
  updateMembers({ patchState }: StateContext<ProjectsStateModel>, { id, payload }: ProjectsAction.UpdateMembers) {
    return this.projectService.updateMembers(id, payload).pipe(
      tap((data) => {
        patchState({ projectDetail: data });
      }),
    );
  }
}
