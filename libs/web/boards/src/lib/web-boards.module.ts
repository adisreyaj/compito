import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ButtonModule,
  IconModule,
  PageHeaderModule,
  TaskSharedModule,
  TimeAgoModule,
  UserAvatarGroupModule,
  UserSelectModule,
} from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { BoardsComponent } from './boards.component';
import { TaskDetailModalComponent } from './shared/components/task-detail-modal/task-detail-modal.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':id/tasks/:taskId',
        component: BoardsComponent,
      },
      {
        path: ':id',
        component: BoardsComponent,
      },
    ]),
    PageHeaderModule,
    IconModule,
    ButtonModule,
    DragDropModule,
    UserAvatarGroupModule,
    TippyModule,
    FormsModule,
    ReactiveFormsModule,
    TimeAgoModule,
    TaskSharedModule,
    UserSelectModule,
    ShimmerModule,
  ],
  declarations: [BoardsComponent, TaskDetailModalComponent],
})
export class WebBoardsModule {}
