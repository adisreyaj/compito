import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';

export const webUsersRoutes: Route[] = [
  {
    path: '',
    component: UsersComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(webUsersRoutes)],
  declarations: [UsersComponent],
})
export class WebUsersModule {}
