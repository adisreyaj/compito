import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TippyModule } from '@ngneat/helipopper';
import { PermissionsDirectiveModule } from '../../directives';
import { IconModule } from '../icon/icon.module';
import { MiniUserCardComponent } from './mini-user-card/mini-user-card.component';
import { UserCardComponent } from './user-card/user-card.component';
import { UserInviteCardComponent } from './user-invite-card/user-invite-card.component';

@NgModule({
  declarations: [MiniUserCardComponent, UserCardComponent, UserInviteCardComponent],
  imports: [CommonModule, IconModule, TippyModule, PermissionsDirectiveModule],
  exports: [MiniUserCardComponent, UserCardComponent, UserInviteCardComponent],
})
export class UserCardModule {}
