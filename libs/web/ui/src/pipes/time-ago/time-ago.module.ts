import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './time-ago.pipe';

@NgModule({
  declarations: [TimeAgoPipe],
  imports: [CommonModule],
  exports: [TimeAgoPipe],
})
export class TimeAgoModule {}
