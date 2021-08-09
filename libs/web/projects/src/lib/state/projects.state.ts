import { Injectable } from '@angular/core';
import { Project } from '@compito/api-interfaces';
import { Action, State, StateContext } from '@ngxs/store';
import { append, patch } from '@ngxs/store/operators';
import { tap } from 'rxjs/operators';
import { ProjectsService } from '../projects.service';
import { ProjectsAction } from './projects.actions';

export class ProjectsStateModel {
  public projects: Project[] = [];
}

const defaults = {
  projects: [],
};

@State<ProjectsStateModel>({
  name: 'projects',
  defaults,
})
@Injectable()
export class ProjectsState {
  constructor(private projectService: ProjectsService) {}
  @Action(ProjectsAction.Add)
  add({ setState }: StateContext<ProjectsStateModel>, { payload }: ProjectsAction.Add) {
    return this.projectService.create(payload).pipe(
      tap((project) => {
        setState(patch(append([project])));
      }),
    );
  }
}
