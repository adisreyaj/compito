import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

const routes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
