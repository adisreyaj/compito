import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Organization, User } from '@compito/api-interfaces';
import { Breadcrumb } from '@compito/web/ui';
import { UsersAction, UsersState } from '@compito/web/users/state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OrgsAction } from '../../state/orgs.actions';
import { OrgsState } from '../../state/orgs.state';

@Component({
  selector: 'compito-orgs-detail',
  templateUrl: './orgs-detail.component.html',
  styles: [
    `
      .orgs {
        &__container {
          @apply pb-6 pt-4;
          &:not(:last-child) {
            @apply border-b;
          }
        }
        &__list {
          @apply pt-2;
          @apply grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4;
        }
      }
    `,
  ],
})
export class OrgsDetailComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', link: '/' },
    { label: 'Orgs', link: '/orgs' },
  ];
  selectedMembers = new Map<string, User>();
  @Select(UsersState.getAllUsers)
  users$!: Observable<User[]>;

  @Select(OrgsState.getOrgDetail)
  orgDetails$!: Observable<Organization | null>;

  constructor(
    private dialog: DialogService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.orgId) {
      this.store.dispatch(new OrgsAction.Get(this.orgId));
      this.store.dispatch(new UsersAction.GetAll({}));
      this.orgDetails$.pipe().subscribe((org) => {
        if (org && org?.members?.length > 0) {
          org?.members.forEach((member) => {
            this.selectedMembers.set(member.id, member);
          });
        }
      });
    }
  }

  toggleMembers(user: User) {
    if (this.selectedMembers.has(user.id)) {
      this.selectedMembers.delete(user.id);
    } else {
      this.selectedMembers.set(user.id, user);
    }
  }

  removeMember(memberId: string) {
    this.store.dispatch(new OrgsAction.UpdateMembers(this.orgId, { type: 'modify', remove: [memberId] }));
  }

  updateMembers() {
    const members = [...this.selectedMembers.keys()];
    this.store.dispatch(new OrgsAction.UpdateMembers(this.orgId, { type: 'set', set: members }));
  }

  addNewProject() {
    this.router.navigate(['/projects/add']);
  }
  private get orgId() {
    return this.activatedRoute.snapshot.params?.id || null;
  }
}
