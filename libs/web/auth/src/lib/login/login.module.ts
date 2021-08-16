import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, IconModule } from '@compito/web/ui';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule, IconModule, ButtonModule],
})
export class LoginModule {}
