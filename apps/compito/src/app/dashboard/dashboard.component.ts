import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Organization } from '@compito/api-interfaces';
import { Select, Store } from '@ngxs/store';
import { OrgsAction } from 'libs/web/orgs/src/lib/state/orgs.actions';
import { OrgsState } from 'libs/web/orgs/src/lib/state/orgs.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'compito-dashboard',
  template: ` <main class="h-screen grid">
    <compito-header></compito-header>
    <section style="min-height: calc(100vh - 64px);">
      <router-outlet></router-outlet>
    </section>
  </main>`,
})
export class DashboardComponent implements OnInit {
  @Select(OrgsState.getAllOrgs)
  orgs$!: Observable<Organization[]>;
  constructor(public auth: AuthService, private http: HttpClient, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new OrgsAction.GetAll());
  }
}
