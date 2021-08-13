import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '../icon/icon.module';
import { UserAvatarGroupModule } from '../user-avatar-group';
import { TaskCardComponent } from './task-card.component';

@NgModule({
  declarations: [TaskCardComponent],
  imports: [CommonModule, IconModule, UserAvatarGroupModule],
  exports: [TaskCardComponent],
})
export class TaskCardModule {}
