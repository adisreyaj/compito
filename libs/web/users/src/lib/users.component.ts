import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Breadcrumb } from '@compito/web/ui';
import { Store } from '@ngxs/store';
import { UsersAction } from './state/users.actions';

@Component({
  selector: 'compito-users',
  template: ` <compito-page-header title="Users" [breadcrumbs]="breadcrumbs"></compito-page-header> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [{ label: 'Home', link: '/' }];
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new UsersAction.GetAll({}));
  }
}
