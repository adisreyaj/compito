import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule, ModalModule, PageHeaderModule } from '@compito/web/ui';
import { TasksCreateModalComponent } from './shared/components/tasks-create-modal/tasks-create-modal.component';
import { TasksComponent } from './tasks.component';
@NgModule({
  declarations: [TasksComponent, TasksCreateModalComponent],
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
  ],
})
export class WebTasksModule {}
