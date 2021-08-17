import { Injectable } from '@angular/core';
import { Organization } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch } from '@ngxs/store/operators';
import { tap } from 'rxjs/operators';
import { OrgService } from '../orgs.service';
import { OrgsAction } from './orgs.actions';

export class OrgsStateModel {
  public orgs: Organization[] = [];
  public orgDetail: Organization | null = null;
}

const defaults: OrgsStateModel = {
  orgs: [],
  orgDetail: null,
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
  getAll({ getState, patchState }: StateContext<OrgsStateModel>) {
    return this.orgService.getAll().pipe(
      tap((result) => {
        patchState({
          orgs: result.payload,
        });
      }),
    );
  }

  @Action(OrgsAction.Get)
  get({ patchState }: StateContext<OrgsStateModel>, { id }: OrgsAction.Get) {
    return this.orgService.getSingle(id).pipe(
      tap((data) => {
        patchState({ orgDetail: data });
      }),
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
