import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserDetails } from '@compito/api-interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { formatUser } from '../../util/format-user.operator';

@Component({
  selector: 'compito-header',
  template: `
    <header class="">
      <div *ngIf="menuOpen | async" class="overlay w-screen h-screen fixed top-0 left-0 bg-black opacity-25 z-30"></div>
      <section class="flex items-stretch space-x-10">
        <div class="menu-open flex items-center relative">
          <button class="flex mr-2 lg:hidden" (click)="menuOpen.next(true)">
            <rmx-icon name="menu-line"></rmx-icon>
          </button>
          <img src="assets/images/logo.svg" alt="Compito" width="55" height="55" class="rounded-full" />
          <p class="absolute top-0 -right-4 z-20 text-gray-500 text-sm">Beta</p>
        </div>
        <nav class="flex-1 flex items-center text-gray-400 font-medium relative" [class.open]="menuOpen | async">
          <button class="menu-close lg:hidden absolute top-4 right-4" (click)="menuOpen.next(false)">
            <rmx-icon name="close-line"></rmx-icon>
          </button>
          <ol class="list-none flex items-center gap-6">
            <li>
              <a
                class="flex items-center space-x-2"
                routerLink="/"
                routerLinkActive="text-gray-800"
                (click)="menuOpen.next(false)"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                <p>Home</p>
              </a>
            </li>
            <ng-container *ngFor="let item of menu">
              <li>
                <a
                  class="flex items-center space-x-2"
                  (click)="menuOpen.next(false)"
                  [routerLink]="item.link"
                  routerLinkActive="text-gray-800"
                >
                  <p>{{ item.label }}</p>
                </a>
              </li>
            </ng-container>
          </ol>
        </nav>
      </section>
      <section class="flex space-x-6 items-center">
        <ng-container *ngIf="user$ | async as user">
          <a
            class="text-xs text-gray-500 hidden md:block"
            [routerLink]="['/orgs', user?.org?.id]"
            tippy="Org you are currently logged into"
          >
            Org: <span class="font-medium text-sm text-gray-700">{{ user?.org?.name }}</span>
          </a>
          <div class="grid grid-cols-1 gap-4 text-gray-400">
            <!-- <button tippy="Coming soon">
              <rmx-icon name="add-circle-line"></rmx-icon>
            </button> -->
            <button tippy="Coming soon" aria-label="Notifications">
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
              [src]="'https://avatar.tobi.sh/' + user.email"
              alt="Adithya"
              width="40"
              height="40"
              class="rounded-full"
            />
            <div class="flex items-center space-x-2">
              <div class="flex flex-col items-end">
                <p class="text-sm font-medium">{{ user?.given_name }}</p>
                <p class="text-xs text-gray-500">{{ user.role?.label }}</p>
              </div>
              <rmx-icon class="text-gray-400" style="width: 16px;height: 16px;" name="arrow-down-s-line"></rmx-icon>
            </div>
          </div>
        </ng-container>
      </section>
    </header>
    <ng-template #userDropdown let-hide>
      <div class="flex flex-col w-48">
        <div class="dropdown-item" routerLink="/profile" (click)="hide()">Profile</div>
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
      @media screen and (max-width: 1024px) {
        nav {
          @apply -translate-x-56 transform duration-300 ease-in opacity-100;
          @apply fixed h-full left-0 top-0 bg-white z-40 w-56 p-8 flex items-start;
          margin-left: 0 !important;
          ol {
            @apply flex flex-col items-start;
          }
          &.open {
            @apply translate-x-0 opacity-100;
          }
        }
      }
      nav a {
        transition: color 0.2s ease-in;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  menu = [
    {
      label: 'My Tasks',
      link: '/tasks',
    },
    {
      label: 'Projects',
      link: '/projects',
    },
    {
      label: 'Users',
      link: '/users',
    },
    {
      label: 'Orgs',
      link: '/orgs',
    },
  ];
  user$: Observable<UserDetails | null> = this.auth.user$.pipe(formatUser());
  menuOpen = new BehaviorSubject(false);
  constructor(public auth: AuthService) {}
}
