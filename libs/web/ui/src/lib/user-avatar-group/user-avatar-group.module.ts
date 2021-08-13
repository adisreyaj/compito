import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TippyModule } from '@ngneat/helipopper';
import { IconModule } from '../icon/icon.module';
import { UserAvatarGroupComponent } from './user-avatar-group.component';

@NgModule({
  declarations: [UserAvatarGroupComponent],
  imports: [CommonModule, TippyModule, IconModule],
  exports: [UserAvatarGroupComponent],
})
export class UserAvatarGroupModule {}
