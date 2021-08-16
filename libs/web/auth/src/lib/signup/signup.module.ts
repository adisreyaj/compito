import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule, IconModule } from '@compito/web/ui';
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
    HttpClientModule,
  ],
})
export class SignupModule {}
