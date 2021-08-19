import { Injectable } from '@angular/core';
import { DataLoading, DataLoadingState, Role, User } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { UsersService } from '../users.service';
import { UsersAction } from './users.actions';

export class UsersStateModel {
  public users: User[] = [];
  public usersFetched = false;
  public roles: Role[] = [];
  public usersLoading: DataLoading = { type: DataLoadingState.init };
}

const defaults: UsersStateModel = {
  users: [],
  usersFetched: false,
  roles: [],
  usersLoading: { type: DataLoadingState.init },
};

@State<UsersStateModel>({
  name: 'users',
  defaults,
})
@Injectable()
export class UsersState {
  @Selector()
  static roles(state: UsersStateModel) {
    return state.roles;
  }
  @Selector()
  static usersLoading(state: UsersStateModel) {
    return state.usersLoading;
  }
  @Selector()
  static usersFetched(state: UsersStateModel) {
    return state.usersFetched;
  }
  @Selector()
  static getAllUsers(state: UsersStateModel) {
    return state.users;
  }
  constructor(private userService: UsersService) {}

  @Action(UsersAction.GetRoles)
  getRoles({ patchState }: StateContext<UsersStateModel>) {
    return this.userService.getAllRoles().pipe(
      tap((data) => {
        patchState({
          roles: data,
        });
      }),
    );
  }

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
            usersFetched: true,
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
