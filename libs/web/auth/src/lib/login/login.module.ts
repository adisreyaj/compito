import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, IconModule, LoadingCardModule, OrgInviteCardModule, TimeAgoModule } from '@compito/web/ui';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { OrgSelectionComponent } from './org-selection/org-selection.component';
import { OrgSelectionCardComponent } from './org-selection/shared/components/org-selection-card/org-selection-card.component';

@NgModule({
  declarations: [LoginComponent, OrgSelectionComponent, OrgSelectionCardComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    IconModule,
    ButtonModule,
    TimeAgoModule,
    ShimmerModule,
    LoadingCardModule,
    A11yModule,
    OrgInviteCardModule,
  ],
})
export class LoginModule {}
