import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnInit,
} from '@angular/core';
import { DialogRef } from '@ngneat/dialog';
import { ModalActionsDirective } from 'libs/web/ui/src/lib/modal/modal-actions/modal-actions.directive';
@Component({
  selector: 'compito-modal',
  template: `<div class="p-4 flex flex-col">
    <header>
      <div>
        <p class="font-medium text-gray-600 text-lg">{{ title }}</p>
      </div>
    </header>
    <section class="flex-1 mt-6">
      <ng-content></ng-content>
    </section>
    <footer>
      <ng-container
        *ngTemplateOutlet="modalActions?.tpl || defaultFooterAction"
      ></ng-container>
    </footer>

    <ng-template #defaultFooterAction>
      <div class="flex items-center justify-end">
        <button btn variant="secondary" (click)="ref?.close()">Close</button>
      </div>
    </ng-template>
  </div>`,
  styles: [
    `
      :host {
        min-height: 280px;
        @apply grid;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnInit {
  @Input() title = '';
  @Input() ref: DialogRef | null = null;
  @ContentChild(ModalActionsDirective)
  modalActions: ModalActionsDirective | null = null;
  constructor() {}

  ngOnInit(): void {
    if (this.ref === null) {
      throw new Error('ref was not passed to the model');
    }
  }
}
