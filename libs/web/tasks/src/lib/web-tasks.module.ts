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
import { TaskDetailModalComponent } from './shared/components/task-detail-modal/task-detail-modal.component';
import { TasksCreateModalComponent } from './shared/components/tasks-create-modal/tasks-create-modal.component';
import { TasksComponent } from './tasks.component';
@NgModule({
  declarations: [TasksComponent, TasksCreateModalComponent, TaskDetailModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TasksComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    ButtonModule,
    PageHeaderModule,
    TimeAgoModule,
    UserAvatarGroupModule,
    IconModule,
    TippyModule,
    A11yModule,
  ],
})
export class WebTasksModule {}
