import { CommonModule } from '@angular/common';
import { Directive, HostBinding, Input, NgModule } from '@angular/core';
import { Priority } from 'libs/api-interfaces/src/lib/priority.interface';

@Directive({
  selector: '[priorityColor]',
})
export class PriorityColorDirective {
  @HostBinding('class')
  get classes() {
    return `${this.class} priority ${this.priorityColor?.toLowerCase()}`;
  }

  @Input() class = '';
  @Input() priorityColor: Priority | null | string = null;
  constructor() {}
}

@NgModule({
  declarations: [PriorityColorDirective],
  imports: [CommonModule],
  exports: [PriorityColorDirective],
})
export class PriorityColorDirectiveModule {}
