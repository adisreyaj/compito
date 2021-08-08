import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from 'libs/web/ui/src/lib/icon/icon.module';
import { DropListConnectionPipe } from 'libs/web/ui/src/lib/task-list/pipes/drop-list-connection.pipe';
import { TaskCardModule } from '../task-card/task-card.module';
import { TaskListComponent } from './task-list.component';
@NgModule({
  declarations: [TaskListComponent, DropListConnectionPipe],
  imports: [CommonModule, DragDropModule, IconModule, TaskCardModule],
  exports: [TaskListComponent, DropListConnectionPipe],
})
export class TaskListModule {}
