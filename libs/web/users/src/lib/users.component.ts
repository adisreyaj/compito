import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataLoading, Role, User } from '@compito/api-interfaces';
import { Breadcrumb, ConfirmModalComponent, ToastService } from '@compito/web/ui';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserRoleUpdateModalComponent } from './shared/components/user-role-update-modal/user-role-update-modal.component';
import { UsersCreateModalComponent } from './shared/components/users-create-modal/users-create-modal.component';
import { UsersAction } from './state/users.actions';
import { UsersState } from './state/users.state';

@Component({
  selector: 'compito-users',
  templateUrl: './users.component.html',
  styles: [
    `
      .projects {
        &__container {
          @apply pb-10 px-8;
        }
        &__list {
          @apply pt-2;
          @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [{ label: 'Home', link: '/' }];

  @Select(UsersState.getAllUsers)
  users$!: Observable<User[]>;

  @Select(UsersState.usersLoading)
  usersLoading$!: Observable<DataLoading>;

  @Select(UsersState.invites)
  invites$!: Observable<any[]>;

  @Select(UsersState.invitesLoading)
  invitesLoading$!: Observable<DataLoading>;

  @Select(UsersState.roles)
  roles$!: Observable<Role[]>;
  constructor(private dialog: DialogService, private store: Store, private toast: ToastService) {}

  ngOnInit(): void {
    this.store.dispatch(new UsersAction.GetAll({}));
    this.store.dispatch(new UsersAction.GetInvites());
    this.store.dispatch(new UsersAction.GetRoles());
  }

  inviteUser(initialData = null) {
    const ref = this.dialog.open(UsersCreateModalComponent, {
      data: {
        roles$: this.roles$,
        initialData,
      },
    });
    ref.afterClosed$
      .pipe(
        switchMap((data) => {
          if (data) {
            return this.store.dispatch(new UsersAction.InviteUser(data)).pipe(
              // Reopen the modal with the filled data if fails
              catchError(() => {
                this.inviteUser(data);
                this.toast.error('Failed to invite user!');
                return throwError(new Error('Failed to invite user!'));
              }),
            );
          }
          return of(null);
        }),
      )
      .subscribe();
  }

  handleInviteCardEvent({ type }: { type: string }, invite: any) {
    switch (type) {
      case 'delete':
        {
          const ref = this.dialog.open(ConfirmModalComponent, {
            size: 'sm',
            data: {
              body: 'Clicking on delete would revoke the invitation. This action cannot be undone.',
              primaryAction: 'Delete',
              primaryActionType: 'warn',
            },
          });
          ref.afterClosed$.subscribe((confirmed) => {
            if (confirmed) {
              this.store.dispatch(new UsersAction.CancelInvite(invite.id));
            }
          });
        }
        break;

      default:
        break;
    }
  }
  handleUserCardEvent({ type }: { type: string }, user: User) {
    switch (type) {
      case 'remove':
        {
          const ref = this.dialog.open(ConfirmModalComponent, {
            size: 'sm',
            data: {
              body: 'Clicking on delete would revoke the invitation. This action cannot be undone.',
              primaryAction: 'Delete',
              primaryActionType: 'warn',
            },
          });
          ref.afterClosed$.subscribe((confirmed) => {
            if (confirmed) {
              // Remove user form org
            }
          });
        }
        break;
      case 'edit':
        {
          const ref = this.dialog.open(UserRoleUpdateModalComponent, {
            size: 'sm',
            data: {
              roles$: this.roles$,
              initialData: {
                role: user.roles[0].role.id,
              },
            },
          });
          ref.afterClosed$.subscribe((data) => {
            if (data) {
              this.store.dispatch(new UsersAction.UpdateUserRole(user.id, data.role));
            }
          });
        }
        break;
      default:
        break;
    }
  }
}
