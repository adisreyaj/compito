import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { LoadingCardComponent } from './loading-card.component';
@NgModule({
  declarations: [LoadingCardComponent],
  imports: [CommonModule, ShimmerModule],
  exports: [LoadingCardComponent, ShimmerModule],
})
export class LoadingCardModule {}
