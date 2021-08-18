import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingCardComponent } from './loading-card.component';

@NgModule({
  declarations: [LoadingCardComponent],
  imports: [CommonModule],
  exports: [LoadingCardComponent],
})
export class LoadingCardModule {}
