import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataLoading, DataLoadingState, Role, User } from '@compito/api-interfaces';
import { Breadcrumb } from '@compito/web/ui';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { UsersCreateModalComponent } from './shared/components/users-create-modal/users-create-modal.component';
import { UsersAction } from './state/users.actions';
import { UsersState } from './state/users.state';

@Component({
  selector: 'compito-users',
  template: `
    <compito-page-header title="Users" [breadcrumbs]="breadcrumbs"></compito-page-header>
    <section class="projects__container">
      <div class="projects__list px-8">
        <article
          (click)="inviteUser()"
          class="p-4 cursor-pointer rounded-md border-2 transition-all duration-200 ease-in
          border-transparent border-dashed bg-gray-100 hover:bg-gray-200 shadow-sm hover:border-primary
          grid place-items-center"
          style="min-height: 226px;"
        >
          <div class="flex items-center space-x-2 text-gray-500">
            <div class=" border rounded-md shadow-sm bg-white">
              <rmx-icon class="w-5 h-5" name="add-line"></rmx-icon>
            </div>
            <p class="text-sm">Invite User</p>
          </div>
        </article>
        <ng-container [ngSwitch]="(uiView$ | async)?.type">
          <ng-container *ngSwitchCase="'SUCCESS'">
            <ng-container *ngFor="let user of users$ | async">
              <compito-users-card [data]="user"></compito-users-card>
            </ng-container>
          </ng-container>
          <ng-container *ngSwitchCase="'LOADING'">
            <ng-container *ngFor="let org of [1]">
              <compito-loading-card height="246px">
                <div class="flex flex-col justify-between h-full flex-1">
                  <header class="mb-2">
                    <shimmer width="100px" height="100px" borderRadius="50%"></shimmer>
                  </header>
                  <div class="flex flex-1 flex-col">
                    <shimmer height="24px" class="mb-1" width="70%" [rounded]="true"></shimmer>
                    <shimmer height="18px" class="mb-1" [rounded]="true"></shimmer>
                    <shimmer height="16px" class="mb-1" width="50%" [rounded]="true"></shimmer>
                  </div>
                  <footer class="flex items-center justify-between">
                    <shimmer height="12px" width="50%" [rounded]="true"></shimmer>
                  </footer>
                </div>
              </compito-loading-card>
            </ng-container>
          </ng-container>
        </ng-container>
      </div>
    </section>
  `,
  styles: [
    `
      .projects {
        &__container {
          @apply pb-10;
        }
        &__list {
          @apply pt-8;
          @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [{ label: 'Home', link: '/' }];

  @Select(UsersState.usersLoading)
  usersLoading$!: Observable<DataLoading>;

  @Select(UsersState.getAllUsers)
  users$!: Observable<User[]>;

  @Select(UsersState.roles)
  roles$!: Observable<Role[]>;

  @Select(UsersState.usersFetched)
  usersFetched$!: Observable<boolean>;

  uiView$: Observable<DataLoading> = this.usersLoading$.pipe(
    withLatestFrom(this.usersFetched$),
    map(([loading, fetched]) => {
      if (fetched) {
        return { type: DataLoadingState.success };
      }
      return loading;
    }),
  );
  constructor(private dialog: DialogService, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new UsersAction.GetAll({}));
    this.store.dispatch(new UsersAction.GetRoles());
  }

  inviteUser() {
    const ref = this.dialog.open(UsersCreateModalComponent, {
      data: {
        roles$: this.roles$,
      },
    });
    ref.afterClosed$.subscribe((data) => {
      if (data) {
        this.store.dispatch(new UsersAction.Add(data));
      }
    });
  }
}
