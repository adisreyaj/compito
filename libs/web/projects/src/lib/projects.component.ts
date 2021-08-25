import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CardEvent, DataLoading, DataLoadingState, Project } from '@compito/api-interfaces';
import { Breadcrumb, ToastService } from '@compito/web/ui';
import { UsersAction, UsersState } from '@compito/web/users/state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { User } from '@prisma/client';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ProjectsCreateModalComponent } from './shared/components/projects-create-modal/projects-create-modal.component';
import { ProjectsAction } from './state/projects.actions';
import { ProjectsState } from './state/projects.state';
@Component({
  selector: 'compito-projects',
  template: ` <compito-page-header title="Projects" [breadcrumbs]="breadcrumbs"> </compito-page-header>
    <section class="projects__container">
      <div class="projects__list px-4 md:px-8">
        <ng-container *ngIf="(usersLoading$ | async)?.type === 'SUCCESS'">
          <article
            *permission="'project:create'"
            (click)="openProjectModal()"
            class="p-4 cursor-pointer rounded-md border-2 transition-all duration-200 ease-in
          border-transparent border-dashed bg-gray-100 hover:bg-gray-200 shadow-sm hover:border-primary
          grid place-items-center"
            style="min-height: 194px;"
          >
            <div class="flex items-center space-x-2 text-gray-500">
              <div class=" border rounded-md shadow-sm bg-white">
                <rmx-icon class="w-5 h-5" name="add-line"></rmx-icon>
              </div>
              <p class="text-sm">Add New Project</p>
            </div>
          </article>
        </ng-container>
        <ng-container [ngSwitch]="(uiView$ | async)?.type">
          <ng-container *ngSwitchCase="'SUCCESS'">
            <ng-container *ngFor="let project of projects$ | async">
              <compito-project-card
                [data]="project"
                (clicked)="handleProjectCardEvents($event, project)"
              ></compito-project-card>
            </ng-container>
          </ng-container>
          <ng-container *ngSwitchCase="'LOADING'">
            <ng-container *ngFor="let org of [1]">
              <compito-loading-card height="194px">
                <div class="flex flex-col justify-between h-full">
                  <header class="flex flex-col space-y-1">
                    <shimmer height="24px" width="60%" [rounded]="true"></shimmer>
                    <shimmer height="14px" [rounded]="true"></shimmer>
                    <shimmer height="14px" width="50%" [rounded]="true"></shimmer>
                  </header>
                  <div class="flex items-center -space-x-4">
                    <shimmer width="40px" height="40px" borderRadius="50%"></shimmer>
                    <shimmer width="40px" height="40px" borderRadius="50%"></shimmer>
                    <shimmer width="40px" height="40px" borderRadius="50%"></shimmer>
                  </div>
                  <footer class="flex items-center justify-between">
                    <shimmer height="16px" width="50%" [rounded]="true"></shimmer>
                  </footer>
                </div>
              </compito-loading-card>
            </ng-container>
          </ng-container>
        </ng-container>
      </div>
    </section>`,
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

  uiView$: Observable<DataLoading> = this.projectsLoading$.pipe(
    withLatestFrom(this.projectsFetched$),
    map(([loading, fetched]) => {
      if (fetched) {
        return { type: DataLoadingState.success };
      }
      return loading;
    }),
  );

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

  handleProjectCardEvents({ type, payload }: CardEvent, project: Project) {
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
        this.store
          .dispatch(new ProjectsAction.Delete(project.id))
          .pipe(
            catchError((error) => {
              this.toast.error(error?.error?.message ?? 'Failed to delete project');
              return EMPTY;
            }),
          )
          .subscribe();
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
