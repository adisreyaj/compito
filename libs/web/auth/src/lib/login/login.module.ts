import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, IconModule, LoadingCardModule, TimeAgoModule } from '@compito/web/ui';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { OrgSelectionComponent } from './org-selection/org-selection.component';
import { OrgInviteCardComponent } from './org-selection/shared/components/org-invite-card/org-invite-card.component';
import { OrgSelectionCardComponent } from './org-selection/shared/components/org-selection-card/org-selection-card.component';
@NgModule({
  declarations: [LoginComponent, OrgSelectionComponent, OrgSelectionCardComponent, OrgInviteCardComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    IconModule,
    ButtonModule,
    TimeAgoModule,
    ShimmerModule,
    LoadingCardModule,
  ],
})
export class LoginModule {}
