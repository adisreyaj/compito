import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  ],
})
export class WebTasksModule {}
