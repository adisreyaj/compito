import { Injectable } from '@angular/core';
import { DataLoading, DataLoadingState, User } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { UsersService } from '../users.service';
import { UsersAction } from './users.actions';

export class UsersStateModel {
  public users: User[] = [];
  public usersLoading: DataLoading = { type: DataLoadingState.init };
}

const defaults: UsersStateModel = {
  users: [],
  usersLoading: { type: DataLoadingState.init },
};

@State<UsersStateModel>({
  name: 'users',
  defaults,
})
@Injectable()
export class UsersState {
  @Selector()
  static usersLoading(state: UsersStateModel) {
    return state.usersLoading;
  }
  @Selector()
  static getAllUsers(state: UsersStateModel) {
    return state.users;
  }
  constructor(private userService: UsersService) {}

  @Action(UsersAction.GetAll)
  getAll({ patchState }: StateContext<UsersStateModel>, { payload }: UsersAction.GetAll) {
    patchState({
      usersLoading: { type: DataLoadingState.loading },
    });
    return this.userService.getAll().pipe(
      tap(
        (result) => {
          patchState({
            users: result.payload,
            usersLoading: { type: DataLoadingState.success },
          });
        },
        () => {
          patchState({
            usersLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }
}
