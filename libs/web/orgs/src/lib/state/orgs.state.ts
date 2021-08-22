import { Injectable } from '@angular/core';
import { DataLoading, DataLoadingState, Organization } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, updateItem } from '@ngxs/store/operators';
import { tap } from 'rxjs/operators';
import { OrgService } from '../orgs.service';
import { OrgsAction } from './orgs.actions';

export class OrgsStateModel {
  public orgs: Organization[] = [];
  public orgsFetched = false;
  public orgsLoading: DataLoading = { type: DataLoadingState.init };
  public orgDetail: Organization | null = null;
  public orgDetailFetched = false;
  public orgDetailLoading: DataLoading = { type: DataLoadingState.init };
}

const defaults: OrgsStateModel = {
  orgs: [],
  orgsLoading: { type: DataLoadingState.init },
  orgsFetched: false,
  orgDetail: null,
  orgDetailLoading: { type: DataLoadingState.init },
  orgDetailFetched: false,
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
  static orgsFetched(state: OrgsStateModel) {
    return state.orgsFetched;
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

  @Action(OrgsAction.Update)
  update({ setState }: StateContext<OrgsStateModel>, { payload, id }: OrgsAction.Update) {
    return this.orgService.update(id, payload).pipe(
      tap((project) => {
        setState(patch({ orgs: updateItem<Organization>((item) => item?.id === id, project) }));
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
            orgsFetched: true,
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
            orgDetailFetched: true,
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
