import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Board, CardEvent, DataLoading, Project, User } from '@compito/api-interfaces';
import { Breadcrumb, ConfirmModalComponent, formatUser, ToastService } from '@compito/web/ui';
import { UsersAction, UsersState } from '@compito/web/users/state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, tap, withLatestFrom } from 'rxjs/operators';
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
          /* @apply grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4; */
          @apply grid gap-4;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      }
    `,
  ],
})
export class ProjectsDetailComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', link: '/' },
    { label: 'Projects', link: '/app/projects' },
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
    private toast: ToastService,
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

  openCreateBoardModal(initialData: any = null, isUpdateMode = false) {
    if (this.projectId) {
      const ref = this.dialog.open(BoardCreateModalComponent, {
        data: {
          initialData,
          isUpdateMode,
        },
      });
      ref.afterClosed$.pipe(withLatestFrom(this.auth.user$.pipe(formatUser()))).subscribe(([data]) => {
        if (data) {
          const action = isUpdateMode
            ? this.store.dispatch(new ProjectsAction.UpdateBoard(initialData?.id, data))
            : this.store.dispatch(new ProjectsAction.AddBoard({ ...data, projectId: this.projectId }));
          action.pipe(
            tap(() => {
              this.toast.success(`Board ${isUpdateMode ? 'updated' : 'created'} successfully!`);
            }),
            // Reopen the modal with the filled data if fails
            catchError(() => {
              this.openCreateBoardModal(data);
              this.toast.error('Failed to create board!');
              return throwError(new Error('Failed to create board!'));
            }),
          );
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
    const user = this.selectedMembers.get(memberId) as User;
    this.selectedMembers.delete(memberId);
    const ref = this.dialog.open(ConfirmModalComponent, {
      size: 'sm',
      data: {
        body: 'The user will not be part of the project anymore. This action cannot be undone.',
        primaryAction: 'Remove',
        primaryActionType: 'warn',
      },
    });
    ref.afterClosed$.subscribe((confirmed) => {
      if (confirmed) {
        this.store
          .dispatch(new ProjectsAction.UpdateMembers(this.projectId, { type: 'modify', remove: [memberId] }))
          .subscribe(
            () => {
              return;
            },
            () => {
              this.selectedMembers.set(memberId, user);
            },
          );
      }
    });
  }

  updateMembers() {
    const members = [...this.selectedMembers.keys()];
    this.store.dispatch(new ProjectsAction.UpdateMembers(this.projectId, { type: 'set', set: members }));
  }

  handleUserSelectEvent({ type, payload }: CardEvent, hide: () => void) {
    switch (type) {
      case 'toggle':
        this.toggleMembers(payload);
        break;
      case 'save':
        this.updateMembers();
        hide();
        break;
    }
  }

  handleBoardCardEvents({ type }: CardEvent, board: Board) {
    switch (type) {
      case 'edit': {
        const data = {
          id: board.id,
          name: board.name,
          description: board.description,
        };
        this.openCreateBoardModal(data, true);
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
                .dispatch(new ProjectsAction.DeleteBoard(board.id))
                .pipe(
                  catchError((error) => {
                    this.toast.error(error?.error?.message ?? 'Failed to delete board');
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

  private get projectId() {
    return this.activatedRoute.snapshot.params?.id || null;
  }
}
