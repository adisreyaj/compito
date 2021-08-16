import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'signup',
        loadChildren: () => import('./signup/signup.module').then((m) => m.SignupModule),
      },
    ]),
  ],
})
export class WebAuthModule {}
