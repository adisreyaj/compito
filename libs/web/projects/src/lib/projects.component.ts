import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DialogService } from '@ngneat/dialog';
import { ProjectsCreateModalComponent } from 'libs/web/projects/src/lib/shared/components/projects-create-modal/projects-create-modal.component';
@Component({
  selector: 'compito-projects',
  template: ` <compito-page-header title="Projects"> </compito-page-header>
    <section class="projects__container">
      <div class="projects__list px-8">
        <compito-project-card></compito-project-card>
        <compito-project-card></compito-project-card>
        <compito-project-card></compito-project-card>
        <compito-project-card></compito-project-card>
        <compito-project-card></compito-project-card>
        <compito-project-card></compito-project-card>
        <compito-project-card></compito-project-card>
        <compito-project-card></compito-project-card>
        <article
          (click)="createNew()"
          class="p-4 cursor-pointer rounded-md border transition-all duration-200 ease-in
        border-gray-300 border-dashed bg-gray-100 hover:bg-gray-200 shadow-sm hover:border-gray-200
          grid place-items-center"
          style="min-height: 180px;"
        >
          <div class="flex items-center space-x-2 text-gray-500">
            <div class=" border rounded-md shadow-sm hover:shadow-md bg-white">
              <rmx-icon class="w-5 h-5" name="add-line"></rmx-icon>
            </div>
            <p class="text-sm">Add New Project</p>
          </div>
        </article>
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
  constructor(private dialog: DialogService) {}

  ngOnInit(): void {}

  createNew() {
    const ref = this.dialog.open(ProjectsCreateModalComponent);
  }
}
