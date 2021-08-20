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
  TaskSharedModule,
  TimeAgoModule,
  UserAvatarGroupModule,
} from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { TasksComponent } from './tasks.component';

@NgModule({
  declarations: [TasksComponent],
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
    TaskSharedModule,
  ],
})
export class WebTasksModule {}
