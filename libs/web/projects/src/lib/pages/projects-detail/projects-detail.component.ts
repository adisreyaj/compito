import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CardEvent, DataLoading, Project, User } from '@compito/api-interfaces';
import { Breadcrumb, formatUser } from '@compito/web/ui';
import { UsersAction, UsersState } from '@compito/web/users/state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { BoardCreateModalComponent } from '../../shared/components/board-create-modal/board-create-modal.component';
import { ProjectsAction } from '../../state/projects.actions';
import { ProjectsState } from '../../state/projects.state';
@Component({
  selector: 'compito-projects-detail',
  templateUrl: './projects-detail.component.html',
  styles: [
    `
      .projects {
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
export class ProjectsDetailComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', link: '/' },
    { label: 'Projects', link: '/projects' },
  ];
  selectedMembers = new Map<string, User>();
  @Select(UsersState.getAllUsers)
  users$!: Observable<User[]>;

  @Select(ProjectsState.getProjectDetail)
  projectDetails$!: Observable<Project | null>;

  @Select(ProjectsState.projectDetailLoading)
  projectDetailLoading$!: Observable<DataLoading>;

  constructor(
    private dialog: DialogService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.projectId) {
      this.store.dispatch(new ProjectsAction.Get(this.projectId));
      this.store.dispatch(new UsersAction.GetAll({}));
      this.projectDetails$.pipe().subscribe((project) => {
        if (project && project?.members?.length > 0) {
          project?.members.forEach((member) => {
            this.selectedMembers.set(member.id, member);
          });
        }
      });
    }
  }

  addNewBoard() {
    if (this.projectId) {
      const ref = this.dialog.open(BoardCreateModalComponent);
      ref.afterClosed$.pipe(withLatestFrom(this.auth.user$.pipe(formatUser()))).subscribe(([data, user]) => {
        if (data) {
          this.store.dispatch(new ProjectsAction.AddBoard({ ...data, projectId: this.projectId, orgId: user?.org }));
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
    this.store.dispatch(new ProjectsAction.UpdateMembers(this.projectId, { type: 'modify', remove: [memberId] }));
  }

  updateMembers() {
    const members = [...this.selectedMembers.keys()];
    this.store.dispatch(new ProjectsAction.UpdateMembers(this.projectId, { type: 'set', set: members }));
  }

  handleUserSelectEvent({ type, payload }: CardEvent) {
    switch (type) {
      case 'toggle':
        this.toggleMembers(payload);
        break;
      case 'save':
        this.updateMembers();
        break;
    }
  }

  private get projectId() {
    return this.activatedRoute.snapshot.params?.id || null;
  }
}
