import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { IconModule, PageHeaderModule } from '@compito/web/ui';
import { NgxsModule } from '@ngxs/store';
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
  ],
  declarations: [UsersComponent],
})
export class WebUsersModule {}
