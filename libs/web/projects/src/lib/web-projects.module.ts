import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule, IconModule, ModalModule, PageHeaderModule, UserAvatarGroupModule } from '@compito/web/ui';
import { NgxsModule } from '@ngxs/store';
import { ProjectsComponent } from './projects.component';
import { ProjectCardComponent } from './shared/components/project-card/project-card.component';
import { ProjectsCreateModalComponent } from './shared/components/projects-create-modal/projects-create-modal.component';
import { ProjectsState } from './state/projects.state';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: ProjectsComponent }]),
    ReactiveFormsModule,
    FormsModule,
    PageHeaderModule,
    NgxsModule.forFeature([ProjectsState]),
    IconModule,
    UserAvatarGroupModule,
    ModalModule,
    ButtonModule,
  ],
  declarations: [ProjectsComponent, ProjectCardComponent, ProjectsCreateModalComponent],
})
export class WebProjectsModule {}
