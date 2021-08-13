import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { ButtonModule, IconModule, ModalModule, PageHeaderModule, TimeAgoModule } from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { NgxsModule } from '@ngxs/store';
import { UsersCardComponent } from './shared/components/users-card/users-card.component';
import { UsersCreateModalComponent } from './shared/components/users-create-modal/users-create-modal.component';
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
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    ButtonModule,
    A11yModule,
  ],
  declarations: [UsersComponent, UsersCardComponent, UsersCreateModalComponent],
})
export class WebUsersModule {}
