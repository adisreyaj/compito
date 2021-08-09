import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ButtonModule,
  IconModule,
  ModalModule,
  PageHeaderModule,
  UserAvatarGroupModule,
} from '@compito/web/ui';
import { ProjectsComponent } from './projects.component';
import { ProjectCardComponent } from './shared/components/project-card/project-card.component';
import { ProjectsCreateModalComponent } from './shared/components/projects-create-modal/projects-create-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProjectsComponent },
    ]),
    PageHeaderModule,
    IconModule,
    UserAvatarGroupModule,
    ModalModule,
    ButtonModule,
  ],
  declarations: [
    ProjectsComponent,
    ProjectCardComponent,
    ProjectsCreateModalComponent,
  ],
})
export class WebProjectsModule {}
