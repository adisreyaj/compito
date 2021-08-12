import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Board } from '@compito/api-interfaces';

@Component({
  selector: 'compito-boards-card',
  template: `<article
      *ngIf="data"
      class="p-4 rounded-md border transition-all hover:shadow-lg duration-200 ease-in
      border-gray-100 bg-white shadow-sm hover:border-gray-200"
    >
      <header class="">
        <div class="flex items-center justify-between">
          <p class="text-md font-medium cursor-pointer hover:text-primary" [routerLink]="['/boards', data.id]">
            {{ data?.name }}
          </p>
          <button
            [tippy]="moreOptions"
            placement="bottom-start"
            variation="menu"
            aria-label="More options"
            class="text-gray-500 hover:bg-gray-100 p-1 rounded-md"
          >
            <rmx-icon class="icon-xs" name="more-2-fill"></rmx-icon>
          </button>
        </div>
        <p class="text-gray-400 text-sm line-clamp-2">{{ data?.description }}</p>
      </header>
      <div class="my-4"></div>
      <footer class="flex items-center justify-between text-xs text-gray-400 mt-4">
        <p>
          Created
          <span class="font-medium text-gray-600">{{ data?.createdAt | timeAgo }}</span>
        </p>
        <p>
          Tasks
          <span class="font-medium text-gray-600">{{ data?.tasks?.length ?? 'n/a' }}</span>
        </p>
      </footer>
    </article>

    <ng-template #moreOptions let-hide>
      <div class="flex flex-col w-44">
        <div class="dropdown-item" (click)="hide()">Edit</div>
        <div class="text-red-600 dropdown-item" (click)="hide()">Delete</div>
      </div>
    </ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsCardComponent implements OnInit {
  @Input() data: Board | null = null;
  constructor() {}

  ngOnInit(): void {}
}
