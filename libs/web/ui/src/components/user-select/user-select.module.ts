import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '../button';
import { IconModule } from '../icon/icon.module';
import { UserSelectComponent } from './user-select.component';

@NgModule({
  declarations: [UserSelectComponent],
  imports: [CommonModule, IconModule, A11yModule, ButtonModule],
  exports: [UserSelectComponent],
})
export class UserSelectModule {}
