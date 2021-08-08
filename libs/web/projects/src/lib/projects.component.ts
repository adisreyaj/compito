import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

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
      </div>
    </section>`,
  styles: [
    `
      .projects {
        &__container {
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
  constructor() {}

  ngOnInit(): void {}
}
