import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CardEvent } from '@compito/api-interfaces';

@Component({
  selector: 'compito-user-invite-card',
  template: `
    <article
      *ngIf="data"
      class="p-4 rounded-md border transition-all hover:shadow-lg duration-200 ease-in
      border-gray-100 bg-white shadow-sm hover:border-gray-200 relative"
    >
      <button
        *permission="'user:update'"
        [tippy]="moreOptions"
        placement="bottom-start"
        variation="menu"
        class="absolute z-10 top-3 right-3 text-gray-500 hover:bg-gray-100 p-1 rounded-md"
      >
        <rmx-icon class="icon-xs" name="more-2-fill"></rmx-icon>
      </button>
      <header class="flex items-center justify-between relative">
        <div class="">
          <p class="text-md font-medium">{{ data?.email }}</p>
          <p class="text-xs text-gray-400">
            Invited By
            <span class="font-medium text-gray-600"
              >{{ data?.invitedBy?.firstName }} {{ data?.invitedBy?.lastName }}</span
            >
          </p>
          <p class="text-xs text-gray-400">
            Role
            <span class="font-medium text-gray-600">{{ data?.role?.label }}</span>
          </p>
        </div>
      </header>
      <div class="my-4"></div>
      <footer class="flex items-center justify-between text-xs text-gray-400 mt-4">
        <div>
          <p>
            Sent on
            <span class="font-medium text-gray-600">{{ data?.createdAt | date: 'mediumDate' }}</span>
          </p>
        </div>
      </footer>
    </article>

    <ng-template #moreOptions let-hide>
      <div class="flex flex-col w-44">
        <!-- <div class="dropdown-item" (click)="clicked.emit({ type: 'edit' }); hide()">Edit</div> -->
        <div class="text-red-600 dropdown-item" (click)="clicked.emit({ type: 'delete' }); hide()">Delete</div>
      </div>
    </ng-template>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInviteCardComponent {
  @Input() data: any;

  @Output() clicked = new EventEmitter<CardEvent>();
}
