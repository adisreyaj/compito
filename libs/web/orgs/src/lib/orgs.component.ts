import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Organization } from '@compito/api-interfaces';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OrgsAction } from './state/orgs.actions';
import { OrgsState } from './state/orgs.state';

@Component({
  selector: 'compito-orgs',
  templateUrl: './orgs.component.html',
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
