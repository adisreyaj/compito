import { NgModule } from '@angular/core';
import { ButtonModule } from '../../button';
import { ConfirmModalComponent } from './confirm-modal.component';

@NgModule({
  imports: [ButtonModule],
  exports: [ConfirmModalComponent],
  declarations: [ConfirmModalComponent],
})
export class ConfirmModalModule {}
