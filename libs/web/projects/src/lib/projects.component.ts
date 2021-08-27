import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CardEvent, DataLoading, Project } from '@compito/api-interfaces';
import { Breadcrumb, ConfirmModalComponent, ToastService } from '@compito/web/ui';
import { UsersAction, UsersState } from '@compito/web/users/state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { User } from '@prisma/client';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ProjectsCreateModalComponent } from './shared/components/projects-create-modal/projects-create-modal.component';
import { ProjectsAction } from './state/projects.actions';
import { ProjectsState } from './state/projects.state';
@Component({
  selector: 'compito-projects',
  templateUrl: './projects.component.html',
  styles: [
    `
      .projects {
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
export class ProjectsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [{ label: 'Home', link: '/' }];

  @Select(ProjectsState.projectsLoading)
  projectsLoading$!: Observable<DataLoading>;

  @Select(ProjectsState.getAllProjects)
  projects$!: Observable<Project[]>;

  @Select(ProjectsState.projectsFetched)
  projectsFetched$!: Observable<boolean>;

  @Select(UsersState.usersLoading)
  usersLoading$!: Observable<DataLoading>;

  @Select(UsersState.getAllUsers)
  users$!: Observable<User[]>;

  constructor(
    private dialog: DialogService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ProjectsAction.GetAll({}));
    this.store.dispatch(new UsersAction.GetAll({}));

    if (this.isAddNewRoute) {
      this.openProjectModal();
    }
  }

  handleProjectCardEvents({ type }: CardEvent, project: Project) {
    switch (type) {
      case 'edit': {
        const data = {
          id: project.id,
          name: project.name,
          description: project.description,
          members: project.members.map(({ id }) => id),
        };
        this.openProjectModal(data, true);
        break;
      }
      case 'delete': {
        const ref = this.dialog.open(ConfirmModalComponent, {
          size: 'sm',
          data: {
            body: 'Proceeding with the action will permanently delete the project. This action cannot be undone.',
            primaryAction: 'Delete',
            primaryActionType: 'warn',
          },
        });
        ref.afterClosed$.subscribe((confirmed) => {
          if (confirmed) {
            this.store
              .dispatch(new ProjectsAction.Delete(project.id))
              .pipe(
                catchError((error) => {
                  this.toast.error(error?.error?.message ?? 'Failed to delete project');
                  return EMPTY;
                }),
              )
              .subscribe();
          }
        });

        break;
      }
      default:
        break;
    }
  }

  openProjectModal(initialData: any = null, isUpdateMode = false) {
    const ref = this.dialog.open(ProjectsCreateModalComponent, {
      data: {
        initialData,
        isUpdateMode,
        users$: this.users$,
      },
    });
    ref.afterClosed$
      .pipe(
        switchMap((data) => {
          if (data) {
            const action = isUpdateMode
              ? this.store.dispatch(new ProjectsAction.Update(initialData.id, data))
              : this.store.dispatch(new ProjectsAction.Add(data));
            action.pipe(
              tap(() => {
                this.toast.success(`Project ${isUpdateMode ? 'updated' : 'created'} successfully!`);
              }),
              // Reopen the modal with the filled data if fails
              catchError(() => {
                this.openProjectModal(data);
                this.toast.error('Failed to create project!');
                return throwError(new Error('Failed to create project!'));
              }),
            );
          }
          return of(null);
        }),
      )
      .subscribe();
  }

  private get isAddNewRoute() {
    return this.activatedRoute.snapshot.url[0]?.path === 'add';
  }
}
