import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ButtonModule,
  IconModule,
  LoadingCardModule,
  ModalModule,
  PageHeaderModule,
  ProjectCardModule,
  TimeAgoModule,
  UserAvatarGroupModule,
  UserSelectModule,
} from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { ProjectsComponent } from './projects.component';
import { BoardCreateModalComponent } from './shared/components/board-create-modal/board-create-modal.component';
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
    ProjectCardModule,
    LoadingCardModule,
    UserSelectModule,
  ],
  declarations: [ProjectsComponent, ProjectsCreateModalComponent, BoardCreateModalComponent],
})
export class WebProjectsModule {}
