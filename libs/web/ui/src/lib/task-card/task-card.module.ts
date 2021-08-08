import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TaskCardComponent } from './task-card.component';

@NgModule({
  declarations: [TaskCardComponent],
  exports: [TaskCardComponent],
  imports: [CommonModule],
})
export class TaskCardModule {}
