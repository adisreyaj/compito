import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TippyModule } from '@ngneat/helipopper';
import { PermissionsDirectiveModule } from '../../directives';
import { PermissionsPipeModule } from '../../pipes';
import { TimeAgoModule } from '../../pipes/time-ago/time-ago.module';
import { UsersToAvatarGroupModule } from '../../pipes/users-to-avatar-group/users-to-avatar-group.module';
import { IconModule } from '../icon/icon.module';
import { UserAvatarGroupModule } from '../user-avatar-group';
import { ProjectCardComponent } from './project-card.component';
import { ProjectMiniCardComponent } from './project-mini-card.component';

@NgModule({
  declarations: [ProjectCardComponent, ProjectMiniCardComponent],
  imports: [
    CommonModule,
    IconModule,
    TippyModule,
    UserAvatarGroupModule,
    TimeAgoModule,
    RouterModule,
    UsersToAvatarGroupModule,
    PermissionsDirectiveModule,
    PermissionsPipeModule,
  ],
  exports: [ProjectCardComponent, ProjectMiniCardComponent],
})
export class ProjectCardModule {}
