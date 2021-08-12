import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Organization } from '@compito/api-interfaces';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OrgsAction } from './state/orgs.actions';
import { OrgsState } from './state/orgs.state';

@Component({
  selector: 'compito-orgs',
  template: ` <compito-page-header title="Orgs"> </compito-page-header>
    <section class="orgs__container">
      <div class="orgs__list px-8">
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
  @Select(OrgsState.getAllOrgs)
  orgs$!: Observable<Organization[]>;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new OrgsAction.GetAll());
  }
}
