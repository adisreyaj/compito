import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule, IconModule, PasswordToggleDirectiveModule } from '@compito/web/ui';
import { SignupComponent } from './signup.component';
@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SignupComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    IconModule,
    A11yModule,
    HttpClientModule,
    PasswordToggleDirectiveModule,
  ],
})
export class SignupModule {}
