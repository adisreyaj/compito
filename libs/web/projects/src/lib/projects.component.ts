import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Project } from '@compito/api-interfaces';
import { Breadcrumb } from '@compito/web/ui';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { ProjectsCreateModalComponent } from 'libs/web/projects/src/lib/shared/components/projects-create-modal/projects-create-modal.component';
import { Observable } from 'rxjs';
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
        <ng-container *ngFor="let project of projects$ | async">
          <compito-project-card [data]="project"></compito-project-card>
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

  @Select(ProjectsState.getAllProjects)
  projects$!: Observable<Project[]>;

  constructor(private dialog: DialogService, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new ProjectsAction.GetAll({}));
  }

  createNew() {
    const ref = this.dialog.open(ProjectsCreateModalComponent);
    ref.afterClosed$.subscribe((data) => {
      if (data) {
        this.store.dispatch(new ProjectsAction.Add(data));
      }
    });
  }
}
