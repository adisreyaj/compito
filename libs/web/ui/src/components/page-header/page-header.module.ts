import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { PageHeaderComponent } from './page-header.component';

@NgModule({
  declarations: [PageHeaderComponent],
  exports: [PageHeaderComponent],
  imports: [CommonModule, RouterModule, ShimmerModule],
})
export class PageHeaderModule {}
