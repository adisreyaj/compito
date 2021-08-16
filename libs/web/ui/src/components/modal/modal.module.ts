import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'libs/web/ui/src/components/button';
import { IconModule } from 'libs/web/ui/src/components/icon/icon.module';
import { ModalActionsDirective } from './modal-actions/modal-actions.directive';
import { ModalComponent } from './modal.component';

@NgModule({
  declarations: [ModalComponent, ModalActionsDirective],
  imports: [CommonModule, IconModule, ButtonModule],
  exports: [ModalComponent, ModalActionsDirective],
})
export class ModalModule {}
