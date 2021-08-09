import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { UsersAction } from './users.actions';

export class UsersStateModel {
  public items: string[];
}

const defaults = {
  items: []
};

@State<UsersStateModel>({
  name: 'users',
  defaults
})
@Injectable()
export class UsersState {
  @Action(UsersAction)
  add({ getState, setState }: StateContext<UsersStateModel>, { payload }: UsersAction) {
    const state = getState();
    setState({ items: [ ...state.items, payload ] });
  }
}
