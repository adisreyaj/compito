import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'compito-header',
  template: `
    <header>
      <section class="flex items-stretch space-x-10">
        <div class="flex items-center">
          <img src="https://avatar.tobi.sh/adi" alt="Compito" width="40" height="40" class="rounded-full" />
        </div>
        <nav class="flex-1 flex items-center text-gray-400 font-medium">
          <ol class="list-none flex items-center gap-6">
            <li>
              <a
                class="flex items-center space-x-2"
                routerLink="/"
                routerLinkActive="text-gray-800"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                <p>Home</p>
              </a>
            </li>
            <ng-container *ngFor="let item of menu">
              <li>
                <a class="flex items-center space-x-2" [routerLink]="item.link" routerLinkActive="text-gray-800">
                  <p>{{ item.label }}</p>
                </a>
              </li>
            </ng-container>
          </ol>
        </nav>
      </section>
      <section class="flex space-x-6 items-center">
        <div class="grid grid-cols-2 gap-4 text-gray-400">
          <button>
            <rmx-icon name="add-circle-line"></rmx-icon>
          </button>
          <button>
            <rmx-icon name="notification-2-line"></rmx-icon>
          </button>
        </div>
        <div
          *ngIf="auth.user$ | async as user"
          class="flex items-center space-x-2 cursor-pointer"
          [tippy]="userDropdown"
          placement="bottom-start"
          variation="menu"
          [offset]="[-10, 10]"
        >
          <img [src]="user.picture" alt="Adithya" width="40" height="40" class="rounded-full" />
          <div class="flex items-center">
            <p class="text-sm font-medium">{{ user.given_name }}</p>
            <rmx-icon class="text-gray-400" style="width: 16px;height: 16px;" name="arrow-down-s-line"></rmx-icon>
          </div>
        </div>
      </section>
    </header>
    <ng-template #userDropdown let-hide>
      <div class="flex flex-col w-48">
        <div class="dropdown-item" routerLink="/profile" (click)="hide()">Preferences</div>
        <div class="text-red-600 dropdown-item" (click)="auth.logout(); hide()">Logout</div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      header {
        @apply flex justify-between items-center px-4 lg:px-8 bg-white;
        height: var(--header-height);
      }

      rmx-icon {
        width: 22px;
        height: 22px;
      }
      nav a {
        transition: color 0.2s ease-in;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  menu = [
    {
      label: 'My Tasks',
      link: '/tasks',
    },
    {
      label: 'Orgs',
      link: '/orgs',
    },
    {
      label: 'Projects',
      link: '/projects',
    },
    {
      label: 'Users',
      link: '/users',
    },
  ];
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}
