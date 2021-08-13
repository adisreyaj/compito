import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconModule, PageHeaderModule, TaskListModule } from '@compito/web/ui';
import { NgxsModule } from '@ngxs/store';
import { BoardsComponent } from './boards.component';
import { BoardsState } from './state/boards.state';
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
    NgxsModule.forFeature([BoardsState]),
    PageHeaderModule,
    IconModule,
    DragDropModule,
    TaskListModule,
  ],
  declarations: [BoardsComponent],
})
export class WebBoardsModule {}
