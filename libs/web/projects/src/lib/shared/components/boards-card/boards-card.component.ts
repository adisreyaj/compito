import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Board, CardEvent } from '@compito/api-interfaces';

@Component({
  selector: 'compito-boards-card',
  template: `<article
      *ngIf="data"
      class="p-4 relative rounded-md border transition-all hover:shadow-lg duration-200 ease-in
      border-gray-100 bg-white shadow-sm hover:border-gray-200"
    >
      <button
        *permission="'project:update'"
        [tippy]="moreOptions"
        placement="bottom-start"
        variation="menu"
        class="absolute z-10 top-3 right-3 text-gray-500 hover:bg-gray-100 p-1 rounded-md"
      >
        <rmx-icon class="icon-xs" name="more-2-fill"></rmx-icon>
      </button>
      <header class="">
        <div class="flex items-center">
          <p class="text-md font-medium cursor-pointer hover:text-primary" [routerLink]="['/app/boards', data.id]">
            {{ data?.name }}
          </p>
        </div>
        <p class="text-gray-400 text-sm line-clamp-2 min-h-2">{{ data?.description }}</p>
      </header>
      <div class="my-4"></div>
      <footer class="flex items-center justify-between text-xs text-gray-400 mt-4">
        <p>
          Created
          <span class="font-medium text-gray-600">{{ data?.createdAt | timeAgo }}</span>
        </p>
      </footer>
    </article>

    <ng-template #moreOptions let-hide>
      <div class="flex flex-col w-44">
        <div class="dropdown-item" (click)="clicked.emit({ type: 'edit' }); hide()">Edit</div>
        <div class="text-red-600 dropdown-item" (click)="clicked.emit({ type: 'delete' }); hide()">Delete</div>
      </div>
    </ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsCardComponent {
  @Input() data: Board | null = null;
  @Output() clicked = new EventEmitter<CardEvent>();
}
