import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IconModule,
  PageHeaderModule,
  UserAvatarGroupModule,
} from '@compito/web/ui';
import { ProjectsComponent } from './projects.component';
import { ProjectCardComponent } from './shared/components/project-card/project-card.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProjectsComponent },
    ]),
    PageHeaderModule,
    IconModule,
    UserAvatarGroupModule,
  ],
  declarations: [ProjectsComponent, ProjectCardComponent],
})
export class WebProjectsModule {}
