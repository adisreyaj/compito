import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CardEvent, DataLoading, DataLoadingState, Organization } from '@compito/api-interfaces';
import { Breadcrumb, ConfirmModalComponent, formatUser, ToastService } from '@compito/web/ui';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { OrgsCreateModalComponent } from './shared/components/orgs-create-modal/orgs-create-modal.component';
import { OrgsAction } from './state/orgs.actions';
import { OrgsState } from './state/orgs.state';

@Component({
  selector: 'compito-orgs',
  template: ` <compito-page-header title="Orgs" [breadcrumbs]="breadcrumbs"></compito-page-header>
    <section class="orgs__container" *ngIf="user$ | async as user">
      <div class="orgs__list px-4 md:px-8">
        <article
          (click)="openProjectModal()"
          class="p-4 cursor-pointer rounded-md border-2 transition-all duration-200 ease-in
          border-transparent border-dashed bg-gray-100 hover:bg-gray-200 shadow-sm hover:border-primary
          grid place-items-center"
          style="min-height: 106px;"
        >
          <div class="flex items-center space-x-2 text-gray-500">
            <div class=" border rounded-md shadow-sm bg-white">
              <rmx-icon class="w-5 h-5" name="add-line"></rmx-icon>
            </div>
            <p class="text-sm">Create New Org</p>
          </div>
        </article>
        <ng-container [ngSwitch]="(uiView$ | async)?.type">
          <ng-container *ngSwitchCase="'SUCCESS'">
            <ng-container *ngFor="let org of orgs$ | async">
              <compito-orgs-card
                [data]="org"
                [user]="user"
                (clicked)="handleProjectCardEvents($event, org)"
              ></compito-orgs-card>
            </ng-container>
          </ng-container>
          <ng-container *ngSwitchCase="'LOADING'">
            <ng-container *ngFor="let org of [1]">
              <compito-loading-card height="106px">
                <div class="flex flex-col justify-between h-full">
                  <shimmer height="24px" [rounded]="true"></shimmer>
                  <footer class="flex items-center justify-between">
                    <shimmer height="12px" width="40%" [rounded]="true"></shimmer>
                    <shimmer height="12px" width="40%" [rounded]="true"></shimmer>
                  </footer>
                </div>
              </compito-loading-card>
            </ng-container>
          </ng-container>
        </ng-container>
      </div>
    </section>`,
  styles: [
    `
      .orgs {
        &__container {
          @apply pb-10;
        }
        &__list {
          @apply pt-8;
          @apply grid gap-4;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [{ label: 'Home', link: '/' }];
  @Select(OrgsState.getAllOrgs)
  orgs$!: Observable<Organization[]>;

  @Select(OrgsState.orgsLoading)
  orgsLoading$!: Observable<DataLoading>;
  @Select(OrgsState.orgsFetched)
  orgsFetched$!: Observable<DataLoading>;

  user$ = this.auth.user$.pipe(formatUser());
  constructor(
    private store: Store,
    private dialog: DialogService,
    private toast: ToastService,
    private auth: AuthService,
  ) {}

  uiView$: Observable<DataLoading> = this.orgsLoading$.pipe(
    withLatestFrom(this.orgsFetched$),
    map(([loading, fetched]) => {
      if (fetched) {
        return { type: DataLoadingState.success };
      }
      return loading;
    }),
  );

  ngOnInit(): void {
    this.store.dispatch(new OrgsAction.GetAll());
  }

  openProjectModal(initialData: any = null, isUpdateMode = false) {
    const ref = this.dialog.open(OrgsCreateModalComponent, {
      data: {
        initialData,
        isUpdateMode,
      },
    });
    ref.afterClosed$
      .pipe(
        switchMap((data) => {
          if (data) {
            const action = isUpdateMode
              ? this.store.dispatch(new OrgsAction.Update(initialData.id, data))
              : this.store.dispatch(new OrgsAction.Add(data));
            action.pipe(
              // Reopen the modal with the filled data if fails
              catchError(() => {
                this.openProjectModal(data);
                this.toast.error('Failed to create org!');
                return throwError(new Error('Failed to create org!'));
              }),
            );
          }
          return of(null);
        }),
      )
      .subscribe();
  }

  handleProjectCardEvents({ type }: CardEvent, org: Organization) {
    switch (type) {
      case 'edit': {
        const data = {
          id: org.id,
          name: org.name,
        };
        this.openProjectModal(data, true);
        break;
      }
      case 'delete':
        {
          const ref = this.dialog.open(ConfirmModalComponent, {
            size: 'sm',
            data: {
              body: 'Proceeding with the action will permanently delete the board. This action cannot be undone.',
              primaryAction: 'Delete',
              primaryActionType: 'warn',
            },
          });
          ref.afterClosed$.subscribe((confirmed) => {
            if (confirmed) {
              this.store
                .dispatch(new OrgsAction.Delete(org.id))
                .pipe(
                  catchError((error) => {
                    this.toast.error(error?.error?.message ?? 'Failed to delete org');
                    return EMPTY;
                  }),
                )
                .subscribe();
            }
          });
        }
        break;

      default:
        break;
    }
  }
}
