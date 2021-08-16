import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconModule, PageHeaderModule, TaskListModule } from '@compito/web/ui';
import { BoardsComponent } from './boards.component';
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
    DragDropModule,
    TaskListModule,
  ],
  declarations: [BoardsComponent],
})
export class WebBoardsModule {}
