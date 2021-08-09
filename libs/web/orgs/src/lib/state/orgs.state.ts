import { Injectable } from '@angular/core';
import { Organization } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { OrgService } from '../orgs.service';
import { OrgsAction } from './orgs.actions';

export class OrgsStateModel {
  public orgs: Organization[] = [];
}

const defaults = {
  orgs: [],
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

  constructor(private orgService: OrgService) {}

  @Action(OrgsAction.GetAll)
  add({ getState, patchState }: StateContext<OrgsStateModel>) {
    return this.orgService.getAll().pipe(
      tap((result) => {
        patchState({
          orgs: result.payload,
        });
      })
    );
  }
}
