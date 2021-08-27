import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CardEvent, DataLoading, Invite, Organization } from '@compito/api-interfaces';
import { Breadcrumb, ConfirmModalComponent, formatUser, ToastService } from '@compito/web/ui';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { OrgsCreateModalComponent } from './shared/components/orgs-create-modal/orgs-create-modal.component';
import { OrgsAction } from './state/orgs.actions';
import { OrgsState } from './state/orgs.state';

@Component({
  selector: 'compito-orgs',
  templateUrl: './orgs.component.html',
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

  @Select(OrgsState.getAllInvites)
  invites$!: Observable<Invite[]>;

  @Select(OrgsState.invitesLoading)
  invitesLoading$!: Observable<DataLoading>;

  user$ = this.auth.user$.pipe(formatUser());
  constructor(
    private store: Store,
    private dialog: DialogService,
    private toast: ToastService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new OrgsAction.GetAll());
    this.store.dispatch(new OrgsAction.GetInvites());
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
              tap(() => {
                this.toast.success(`Org ${isUpdateMode ? 'updated' : 'created'} successfully!`);
              }),
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

  handleInvite(type: 'accept' | 'reject', id: string) {
    switch (type) {
      case 'accept':
        this.store.dispatch(new OrgsAction.AcceptInvite(id));
        break;
      case 'reject':
        this.store.dispatch(new OrgsAction.RejectInvite(id));
        break;

      default:
        break;
    }
  }
}
