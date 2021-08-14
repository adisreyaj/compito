import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Organization } from '@compito/api-interfaces';
import { Breadcrumb } from '@compito/web/ui';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OrgsCreateModalComponent } from './shared/components/orgs-create-modal/orgs-create-modal.component';
import { OrgsAction } from './state/orgs.actions';
import { OrgsState } from './state/orgs.state';

@Component({
  selector: 'compito-orgs',
  template: ` <compito-page-header title="Orgs" [breadcrumbs]="breadcrumbs"></compito-page-header>
    <section class="orgs__container">
      <div class="orgs__list px-8">
        <article
          (click)="createNew()"
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
        <ng-container *ngFor="let org of orgs$ | async">
          <compito-orgs-card [data]="org"></compito-orgs-card>
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
          @apply grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4;
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
  constructor(private store: Store, private dialog: DialogService) {}

  ngOnInit(): void {
    this.store.dispatch(new OrgsAction.GetAll());
  }

  createNew() {
    const ref = this.dialog.open(OrgsCreateModalComponent);
    ref.afterClosed$.subscribe((data) => {
      if (data) {
        this.store.dispatch(new OrgsAction.Add(data));
      }
    });
  }
}
