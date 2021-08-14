import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ButtonModule,
  IconModule,
  ModalModule,
  PageHeaderModule,
  TimeAgoModule,
  UserAvatarGroupModule,
} from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { ProjectsComponent } from './projects.component';
import { BoardCreateModalComponent } from './shared/components/board-create-modal/board-create-modal.component';
import { ProjectCardComponent } from './shared/components/project-card/project-card.component';
import { ProjectsCreateModalComponent } from './shared/components/projects-create-modal/projects-create-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProjectsComponent },
      { path: 'add', component: ProjectsComponent },
      {
        path: ':id',
        loadChildren: () =>
          import('./pages/projects-detail/projects-detail.module').then((m) => m.ProjectsDetailModule),
      },
    ]),
    ReactiveFormsModule,
    FormsModule,
    PageHeaderModule,
    IconModule,
    UserAvatarGroupModule,
    ModalModule,
    ButtonModule,
    A11yModule,
    TippyModule,
    TimeAgoModule,
  ],
  declarations: [ProjectsComponent, ProjectCardComponent, ProjectsCreateModalComponent, BoardCreateModalComponent],
})
export class WebProjectsModule {}
