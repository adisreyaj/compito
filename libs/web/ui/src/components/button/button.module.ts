import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonComponent } from 'libs/web/ui/src/components/button/button.component';

@NgModule({
  declarations: [ButtonComponent],
  exports: [ButtonComponent],
  imports: [CommonModule],
})
export class ButtonModule {}
