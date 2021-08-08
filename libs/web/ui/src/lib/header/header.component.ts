import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'compito-header',
  template: `
    <div class="flex space-x-2 items-center">
      <img
        src="https://avatar.tobi.sh/adi"
        alt="Compito"
        width="40"
        height="40"
        class="rounded-full"
      />
      <p class="text-lg font-bold">Compito</p>
    </div>
    <div class="flex space-x-6 items-center">
      <div class="grid grid-cols-2 gap-4 text-gray-400">
        <button>
          <rmx-icon name="add-circle-line"></rmx-icon>
        </button>
        <button>
          <rmx-icon name="notification-2-line"></rmx-icon>
        </button>
      </div>
      <div
        class="flex items-center space-x-2 cursor-pointer"
        [tippy]="userDropdown"
        placement="bottom-start"
        variation="menu"
        [offset]="[-10, 10]"
      >
        <img
          src="https://avatars.githubusercontent.com/u/29002760?v=4"
          alt="Adithya"
          width="40"
          height="40"
          class="rounded-full"
        />
        <div>
          <p class="text-sm font-medium">Adithya</p>
          <p class="text-xs text-gray-600">Super Admin</p>
        </div>
      </div>
    </div>

    <ng-template #userDropdown let-hide>
      <div class="flex flex-col w-48">
        <div class="dropdown-item" routerLink="/profile" (click)="hide()">
          Preferences
        </div>
        <div class="text-red-600 dropdown-item" (click)="hide()">Logout</div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        @apply flex justify-between items-center px-4 lg:px-8 h-16 bg-white;
      }

      rmx-icon {
        width: 22px;
        height: 22px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
