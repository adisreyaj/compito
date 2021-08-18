import { Injectable } from '@angular/core';
import { DataLoading, DataLoadingState, Organization } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch } from '@ngxs/store/operators';
import { tap } from 'rxjs/operators';
import { OrgService } from '../orgs.service';
import { OrgsAction } from './orgs.actions';

export class OrgsStateModel {
  public orgs: Organization[] = [];
  public orgsLoading: DataLoading = { type: DataLoadingState.init };
  public orgDetail: Organization | null = null;
  public orgDetailLoading: DataLoading = { type: DataLoadingState.init };
}

const defaults: OrgsStateModel = {
  orgs: [],
  orgDetail: null,
  orgsLoading: { type: DataLoadingState.init },
  orgDetailLoading: { type: DataLoadingState.init },
};

@State<OrgsStateModel>({
  name: 'orgs',
  defaults,
})
@Injectable()
export class OrgsState {
  @Selector()
  static getAllOrgs(state: OrgsStateModel) {
    return state.orgs;
  }
  @Selector()
  static orgsLoading(state: OrgsStateModel) {
    return state.orgsLoading;
  }
  @Selector()
  static orgDetailLoading(state: OrgsStateModel) {
    return state.orgDetailLoading;
  }
  @Selector()
  static getOrgDetail(state: OrgsStateModel) {
    return state.orgDetail;
  }

  constructor(private orgService: OrgService) {}

  @Action(OrgsAction.Add)
  add({ setState }: StateContext<OrgsStateModel>, { payload }: OrgsAction.Add) {
    return this.orgService.create(payload).pipe(
      tap((result) => {
        setState(
          patch({
            orgs: append([result]),
          }),
        );
      }),
    );
  }
  @Action(OrgsAction.GetAll)
  getAll({ patchState }: StateContext<OrgsStateModel>) {
    patchState({
      orgsLoading: { type: DataLoadingState.loading },
    });
    return this.orgService.getAll().pipe(
      tap(
        (result) => {
          patchState({
            orgs: result.payload,
            orgsLoading: { type: DataLoadingState.success },
          });
        },
        () => {
          patchState({
            orgsLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }

  @Action(OrgsAction.Get)
  get({ patchState }: StateContext<OrgsStateModel>, { id }: OrgsAction.Get) {
    patchState({
      orgDetailLoading: { type: DataLoadingState.loading },
    });
    return this.orgService.getSingle(id).pipe(
      tap(
        (data) => {
          patchState({
            orgDetail: data,
            orgDetailLoading: { type: DataLoadingState.success },
          });
        },
        () => {
          patchState({
            orgDetailLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }

  @Action(OrgsAction.UpdateMembers)
  updateMembers({ patchState }: StateContext<OrgsStateModel>, { id, payload }: OrgsAction.UpdateMembers) {
    return this.orgService.updateMembers(id, payload).pipe(
      tap((data) => {
        patchState({ orgDetail: data });
      }),
    );
  }
}
