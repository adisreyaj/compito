import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import {
  ButtonModule,
  IconModule,
  LoadingCardModule,
  ModalModule,
  PageHeaderModule,
  SectionHeaderModule,
  TimeAgoModule,
  UserCardModule,
} from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { UsersCreateModalComponent } from './shared/components/users-create-modal/users-create-modal.component';
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
    IconModule,
    PageHeaderModule,
    TippyModule,
    TimeAgoModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    ButtonModule,
    A11yModule,
    LoadingCardModule,
    UserCardModule,
    SectionHeaderModule,
  ],
  declarations: [UsersComponent, UsersCreateModalComponent],
})
export class WebUsersModule {}
