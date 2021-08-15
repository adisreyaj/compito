import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconModule, PageHeaderModule, TimeAgoModule, UserAvatarGroupModule } from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { NgxsModule } from '@ngxs/store';
import { OrgsComponent } from './orgs.component';
import { OrgsCardComponent } from './shared/components/orgs-card/orgs-card.component';
import { OrgsState } from './state/orgs.state';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: OrgsComponent }]),
    PageHeaderModule,
    NgxsModule.forFeature([OrgsState]),
    TippyModule,
    IconModule,
    TimeAgoModule,
    UserAvatarGroupModule,
  ],
  declarations: [OrgsComponent, OrgsCardComponent],
})
export class WebOrgsModule {}
