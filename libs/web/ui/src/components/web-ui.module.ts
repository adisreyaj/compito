import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersToAvatarGroupPipe } from './users-to-avatar-group.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    UsersToAvatarGroupPipe
  ],
})
export class WebUiModule {}
