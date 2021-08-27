import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { ButtonModule } from '../../button';
import { ConfirmModalComponent } from './confirm-modal.component';
@NgModule({
  imports: [ButtonModule, A11yModule],
  exports: [ConfirmModalComponent],
  declarations: [ConfirmModalComponent],
})
export class ConfirmModalModule {}
