import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageHeaderModule } from '@compito/web/ui';
import { NgxsModule } from '@ngxs/store';
import { OrgsComponent } from './orgs.component';
import { OrgsState } from './state/orgs.state';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: OrgsComponent }]),
    PageHeaderModule,
    NgxsModule.forFeature([OrgsState]),
  ],
  declarations: [OrgsComponent],
})
export class WebOrgsModule {}
