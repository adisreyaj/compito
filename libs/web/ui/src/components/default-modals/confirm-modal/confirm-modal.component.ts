import { Component, OnInit } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';

export interface ConfirmModalData {
  title: string;
  body: string;
  primaryAction: string;
  primaryActionType: 'primary' | 'secondary' | 'warn';
}

@Component({
  selector: 'compito-confirm-modal',
  template: `
    <header>
      <h2 class="font-medium text-gray-600 text-lg">{{ ref?.data?.title ?? 'Are you sure?' }}</h2>
    </header>
    <div class="flex-1 mt-4 text-sm text-gray-600">
      {{ ref?.data?.body ?? 'Confirm your action as it cannot be reversed. Are you sure that you want to proceed?' }}
    </div>
    <footer class="flex justify-end space-x-4">
      <button btn variant="secondary" (click)="ref.close(false)">Close</button>
      <button btn [variant]="ref?.data?.primaryActionType ?? 'primary'" (click)="ref.close(true)">
        {{ ref?.data?.primaryAction ?? 'Confirm' }}
      </button>
    </footer>
  `,
  styles: [
    `
      :host {
        min-height: 200px;
        @apply p-4 flex flex-col;
      }
    `,
  ],
})
export class ConfirmModalComponent implements OnInit {
  constructor(public ref: DialogRef<ConfirmModalData>) {}

  ngOnInit() {}
}
