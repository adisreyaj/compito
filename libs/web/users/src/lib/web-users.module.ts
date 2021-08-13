import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { IconModule, PageHeaderModule, TimeAgoModule } from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { NgxsModule } from '@ngxs/store';
import { UsersCardComponent } from './shared/components/users-card/users-card.component';
import { UsersState } from './state/users.state';
import { UsersComponent } from './users.component';
export const webUsersRoutes: Route[] = [
  {
    path: '',
    component: UsersComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(webUsersRoutes),
    NgxsModule.forFeature([UsersState]),
    IconModule,
    PageHeaderModule,
    TippyModule,
    TimeAgoModule,
  ],
  declarations: [UsersComponent, UsersCardComponent],
})
export class WebUsersModule {}
