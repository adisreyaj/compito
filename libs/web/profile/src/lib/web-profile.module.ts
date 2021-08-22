import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule, PageHeaderModule, PasswordToggleDirectiveModule } from '@compito/web/ui';
import { ProfileComponent } from './profile.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: ProfileComponent }]),
    PageHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordToggleDirectiveModule,
  ],
  declarations: [ProfileComponent],
})
export class WebProfileModule {}
