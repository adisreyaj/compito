import { A11yModule } from '@angular/cdk/a11y';
import { TextFieldModule } from '@angular/cdk/text-field';
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
  PriorityColorDirectiveModule,
  TimeAgoModule,
  UserAvatarGroupModule,
} from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { MyTaskCardComponent } from './shared/components/my-task-card/my-task-card.component';
import { TaskDetailModalComponent } from './shared/components/task-detail-modal/task-detail-modal.component';
import { TasksCreateModalComponent } from './shared/components/tasks-create-modal/tasks-create-modal.component';
import { TasksComponent } from './tasks.component';

@NgModule({
  declarations: [TasksComponent, TasksCreateModalComponent, TaskDetailModalComponent, MyTaskCardComponent],
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
    PriorityColorDirectiveModule,
    LoadingCardModule,
    TextFieldModule,
  ],
})
export class WebTasksModule {}
