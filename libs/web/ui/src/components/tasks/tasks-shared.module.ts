import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TippyModule } from '@ngneat/helipopper';
import { PriorityColorDirectiveModule } from '../../directives';
import { TimeAgoModule, UsersToAvatarGroupModule } from '../../pipes';
import { ButtonModule } from '../button';
import { IconModule } from '../icon/icon.module';
import { ModalModule } from '../modal';
import { UserAvatarGroupModule } from '../user-avatar-group';
import { MyTaskCardComponent } from './my-task-card/my-task-card.component';
import { TaskCardComponent } from './task-card/task-card.component';
import { DropListConnectionPipe } from './task-list/pipes/drop-list-connection.pipe';
import { TaskListComponent } from './task-list/task-list.component';
import { TasksCreateModalComponent } from './tasks-create-modal/tasks-create-modal.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    ButtonModule,
    TimeAgoModule,
    FormsModule,
    ReactiveFormsModule,
    TippyModule,
    UserAvatarGroupModule,
    DragDropModule,
    UsersToAvatarGroupModule,
    A11yModule,
    ModalModule,
    RouterModule,
    PriorityColorDirectiveModule,
  ],
  exports: [
    TaskCardComponent,
    TaskListComponent,
    TasksCreateModalComponent,
    DropListConnectionPipe,
    MyTaskCardComponent,
  ],
  declarations: [
    TaskCardComponent,
    TaskListComponent,
    TasksCreateModalComponent,
    DropListConnectionPipe,
    MyTaskCardComponent,
  ],
})
export class TaskSharedModule {}
