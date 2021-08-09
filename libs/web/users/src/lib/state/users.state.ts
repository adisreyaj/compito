import { Injectable } from '@angular/core';
import { User } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { UsersService } from '../users.service';
import { UsersAction } from './users.actions';

export class UsersStateModel {
  public users: User[] = [];
}

const defaults = {
  users: [],
};

@State<UsersStateModel>({
  name: 'users',
  defaults,
})
@Injectable()
export class UsersState {
  @Selector()
  static getAllUsers(state: UsersStateModel) {
    return state.users;
  }
  constructor(private userService: UsersService) {}

  @Action(UsersAction.Add)
  add({ getState, setState }: StateContext<UsersStateModel>, { payload }: UsersAction.Add) {}

  @Action(UsersAction.GetAll)
  getAll({ getState, patchState }: StateContext<UsersStateModel>, { payload }: UsersAction.GetAll) {
    return this.userService.getAll().pipe(
      tap((result) => {
        patchState({
          users: result.payload,
        });
      }),
    );
  }
}
