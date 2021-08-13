import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersToAvatarGroupPipe } from './users-to-avatar-group.pipe';

@NgModule({
  declarations: [UsersToAvatarGroupPipe],
  imports: [CommonModule],
  exports: [UsersToAvatarGroupPipe],
})
export class UsersToAvatarGroupModule {}
