import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TippyModule } from '@ngneat/helipopper';
import { IconModule } from '../icon/icon.module';
import { MiniUserCardComponent } from './mini-user-card/mini-user-card.component';
import { UserCardComponent } from './user-card/user-card.component';

@NgModule({
  declarations: [MiniUserCardComponent, UserCardComponent],
  imports: [CommonModule, IconModule, TippyModule],
  exports: [MiniUserCardComponent, UserCardComponent],
})
export class UserCardModule {}
