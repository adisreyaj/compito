import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, IconModule } from '@compito/web/ui';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { OrgSelectionComponent } from './org-selection/org-selection.component';

@NgModule({
  declarations: [LoginComponent, OrgSelectionComponent],
  imports: [CommonModule, LoginRoutingModule, IconModule, ButtonModule],
})
export class LoginModule {}
