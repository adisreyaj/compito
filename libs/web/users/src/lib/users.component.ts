import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { User } from '@compito/api-interfaces';
import { Breadcrumb } from '@compito/web/ui';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
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
          (click)="createNew()"
          class="p-4 cursor-pointer rounded-md border-2 transition-all duration-200 ease-in
          border-transparent border-dashed bg-gray-100 hover:bg-gray-200 shadow-sm hover:border-primary
          grid place-items-center"
          style="min-height: 226px;"
        >
          <div class="flex items-center space-x-2 text-gray-500">
            <div class=" border rounded-md shadow-sm bg-white">
              <rmx-icon class="w-5 h-5" name="add-line"></rmx-icon>
            </div>
            <p class="text-sm">Add New User</p>
          </div>
        </article>
        <ng-container *ngFor="let user of users$ | async">
          <compito-users-card [data]="user"></compito-users-card>
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

  @Select(UsersState.getAllUsers)
  users$!: Observable<User[]>;
  constructor(private dialog: DialogService, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new UsersAction.GetAll({}));
  }

  createNew() {
    const ref = this.dialog.open(UsersCreateModalComponent);
    ref.afterClosed$.subscribe((data) => {
      if (data) {
        this.store.dispatch(new UsersAction.Add(data));
      }
    });
  }
}
