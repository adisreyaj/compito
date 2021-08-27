import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ButtonModule,
  IconModule,
  LoadingCardModule,
  ModalModule,
  OrgInviteCardModule,
  PageHeaderModule,
  SectionHeaderModule,
  TimeAgoModule,
  UserAvatarGroupModule,
} from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { OrgsComponent } from './orgs.component';
import { OrgsCardComponent } from './shared/components/orgs-card/orgs-card.component';
import { OrgsCreateModalComponent } from './shared/components/orgs-create-modal/orgs-create-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: OrgsComponent },
      {
        path: ':id',
        loadChildren: () => import('./pages/orgs-detail/orgs-detail.module').then((m) => m.OrgsDetailModule),
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    TippyModule,
    IconModule,
    TimeAgoModule,
    ButtonModule,
    UserAvatarGroupModule,
    ModalModule,
    A11yModule,
    LoadingCardModule,
    OrgInviteCardModule,
    SectionHeaderModule,
  ],
  declarations: [OrgsComponent, OrgsCardComponent, OrgsCreateModalComponent],
})
export class WebOrgsModule {}
