import { Injectable } from '@angular/core';
import { DataLoading, DataLoadingState, Role, User } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { tap } from 'rxjs/operators';
import { UsersService } from '../users.service';
import { UsersAction } from './users.actions';

export class UsersStateModel {
  public users: User[] = [];
  public usersFetched = false;
  public roles: Role[] = [];
  public usersLoading: DataLoading = { type: DataLoadingState.init };
  public invites: User[] = [];
  public invitesFetched = false;
  public invitesLoading: DataLoading = { type: DataLoadingState.init };
}

const defaults: UsersStateModel = {
  users: [],
  usersFetched: false,
  roles: [],
  usersLoading: { type: DataLoadingState.init },
  invites: [],
  invitesFetched: false,
  invitesLoading: { type: DataLoadingState.init },
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
    if (state.usersFetched && state.usersLoading.type !== DataLoadingState.error) {
      return { type: DataLoadingState.success };
    }
    return state.usersLoading;
  }
  @Selector()
  static getAllUsers(state: UsersStateModel) {
    return state.users;
  }
  @Selector()
  static invites(state: UsersStateModel) {
    return state.invites;
  }

  @Selector()
  static invitesLoading(state: UsersStateModel) {
    if (state.invitesFetched && state.invitesLoading.type !== DataLoadingState.error) {
      return { type: DataLoadingState.success };
    }
    return state.invitesLoading;
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
  @Action(UsersAction.InviteUser)
  invite({ setState }: StateContext<UsersStateModel>, { payload }: UsersAction.InviteUser) {
    return this.userService.inviteUser(payload).pipe(
      tap((data) => {
        setState(
          patch({
            invites: append([data]),
          }),
        );
      }),
    );
  }
  @Action(UsersAction.CancelInvite)
  cancelInvite({ setState }: StateContext<UsersStateModel>, { id }: UsersAction.CancelInvite) {
    return this.userService.cancelInvite(id).pipe(
      tap((data) => {
        setState(
          patch({
            invites: removeItem<any>(({ id: inviteId }) => id === id),
          }),
        );
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
  @Action(UsersAction.GetInvites)
  getAllInvites({ patchState }: StateContext<UsersStateModel>) {
    patchState({
      invitesLoading: { type: DataLoadingState.loading },
    });
    return this.userService.getInvites().pipe(
      tap(
        (result) => {
          patchState({
            invites: result,
            invitesLoading: { type: DataLoadingState.success },
            invitesFetched: true,
          });
        },
        () => {
          patchState({
            invitesLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }
}
