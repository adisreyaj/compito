import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TippyModule } from '@ngneat/helipopper';
import { TimeAgoModule } from '../../pipes/time-ago/time-ago.module';
import { IconModule } from '../icon/icon.module';
import { UserAvatarGroupModule } from '../user-avatar-group';
import { ProjectCardComponent } from './project-card.component';

@NgModule({
  declarations: [ProjectCardComponent],
  imports: [CommonModule, IconModule, TippyModule, UserAvatarGroupModule, TimeAgoModule, RouterModule],
  exports: [ProjectCardComponent],
})
export class ProjectCardModule {}
