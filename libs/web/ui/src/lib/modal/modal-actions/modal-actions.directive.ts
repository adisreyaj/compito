import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[compitoModalActions]',
})
export class ModalActionsDirective {
  constructor(public tpl: TemplateRef<HTMLElement>) {}
}
