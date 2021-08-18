import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DataLoading, Project } from '@compito/api-interfaces';
import { Breadcrumb, formatUser } from '@compito/web/ui';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { ProjectsCreateModalComponent } from 'libs/web/projects/src/lib/shared/components/projects-create-modal/projects-create-modal.component';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { ProjectsAction } from './state/projects.actions';
import { ProjectsState } from './state/projects.state';
@Component({
  selector: 'compito-projects',
  template: ` <compito-page-header title="Projects" [breadcrumbs]="breadcrumbs"> </compito-page-header>
    <section class="projects__container">
      <div class="projects__list px-8">
        <article
          (click)="createNew()"
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
        <ng-container [ngSwitch]="(projectsLoading$ | async)?.type">
          <ng-container *ngSwitchCase="'SUCCESS'">
            <ng-container *ngFor="let project of projects$ | async">
              <compito-project-card [data]="project"></compito-project-card>
            </ng-container>
          </ng-container>
          <ng-container *ngSwitchCase="'LOADING'">
            <ng-container *ngFor="let org of [1, 2]">
              <compito-loading-card height="194px">
                <div class="flex flex-col justify-between h-full">
                  <header>
                    <shimmer height="24px" [rounded]="true"></shimmer>
                    <shimmer height="40px" [rounded]="true"></shimmer>
                  </header>
                  <div>
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
          @apply grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4;
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

  constructor(
    private dialog: DialogService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ProjectsAction.GetAll({}));
    if (this.isAddNewRoute) {
      this.createNew();
    }
    this.auth.user$.subscribe(console.log);
  }

  createNew() {
    const ref = this.dialog.open(ProjectsCreateModalComponent);
    ref.afterClosed$.pipe(withLatestFrom(this.auth.user$.pipe(formatUser()))).subscribe(([data, user]) => {
      if (data) {
        this.store.dispatch(new ProjectsAction.Add({ ...data, orgId: user?.org }));
      }
    });
  }

  private get isAddNewRoute() {
    return this.activatedRoute.snapshot.url[0]?.path === 'add';
  }
}
