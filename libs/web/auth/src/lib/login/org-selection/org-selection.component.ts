import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'compito-org-selection',
  template: `
    <main class="grid org-selection">
      <div class="grid place-items-center relative">
        <div class="flex items-center absolute top-10 left-10">
          <img src="assets/images/logo-full.svg" alt="Compito" width="150" height="55" class="rounded-full" />
        </div>
        <section class="flex flex-col items-center">
          <img src="assets/images/welcome.svg" alt="Welcome" height="300" width="300" />
          <div class="flex items-center space-x-2">
            <h1 class="text-4xl font-bold">Login Successful!</h1>
            <div class="bg-green-500 rounded-full p-1 text-white">
              <rmx-icon class="" name="arrow-right-line"></rmx-icon>
            </div>
          </div>
          <p class="mt-2 text-gray-500">Choose which org to access from below</p>
        </section>
      </div>
      <div class="overflow-y-auto grid place-items-center bg-gray-100">
        <div class="w-full px-8 2xl:px-10">
          <section class="mb-10">
            <ng-container
              *ngTemplateOutlet="
                sectionHeader;
                context: {
                  $implicit: 'Your Orgs',
                  subtitle: 'You are part of multiple Orgs, select an org to login to'
                }
              "
            ></ng-container>
            <div class="orgs__list">
              <ng-container *ngFor="let item of orgs">
                <article
                  tabindex="0"
                  class="p-4 relative rounded-md border cursor-pointer transition-all hover:shadow-lg duration-200 ease-in
                     border-gray-100 bg-white shadow-sm ring-primary hover:ring-2 focus:ring-2 outline-none"
                >
                  <header class="flex items-center justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <p class="text-md font-medium cursor-pointer hover:text-primary">Sreyaj</p>
                      </div>
                    </div>
                  </header>
                  <div class="my-4">
                    <!-- <compito-user-avatar-group [data]="[]"></compito-user-avatar-group> -->
                  </div>
                  <footer class="flex items-center justify-between text-xs text-gray-400 mt-4">
                    <p>
                      Created
                      <!-- <span class="font-medium text-gray-600">{{ data?.createdAt | timeAgo }}</span> -->
                    </p>
                  </footer>
                </article>
              </ng-container>
            </div>
          </section>
          <section>
            <ng-container
              *ngTemplateOutlet="
                sectionHeader;
                context: {
                  $implicit: 'Pending Invites',
                  subtitle: 'You have pending invites. You can log into them once accepted'
                }
              "
            ></ng-container>
            <div class="invites__list">
              <ng-container *ngFor="let item of orgs">
                <article
                  class="p-4 relative rounded-md border transition-all duration-200 ease-in
                     border-gray-100 bg-white shadow-sm"
                >
                  <header class="">
                    <div>
                      <div class="flex items-center justify-between">
                        <p class="text-md font-medium cursor-pointer hover:text-primary">Sreyaj</p>
                      </div>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      <p>
                        Invited
                        <span class="font-medium text-gray-600">2 days ago</span> by
                        <span class="font-medium text-gray-600">John Doe</span>
                      </p>
                    </div>
                  </header>
                  <footer class="flex justify-end space-x-4 mt-4">
                    <button btn size="sm" type="button" variant="secondary" (click)="({})">Reject</button>
                    <button btn size="sm" type="submit" form="orgForm" variant="primary">Accept & Login</button>
                  </footer>
                </article>
              </ng-container>
            </div>
          </section>
        </div>
      </div>
    </main>

    <ng-template #sectionHeader let-title let-subtitle="subtitle">
      <header>
        <h2 class="font-bold text-xl">{{ title }}</h2>
        <p class="text-gray-500">{{ subtitle }}</p>
      </header>
    </ng-template>
  `,
  styles: [
    `
      header.main {
        @apply flex justify-between items-center px-4 px-4 lg:px-8 bg-white xl:px-20;
        height: 80px;
      }
      main.org-selection {
        height: 100vh;
        grid-template-columns: 3fr 5fr;
      }
      .orgs {
        &__list {
          @apply pt-8;
          @apply grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4;
        }
      }
      .invites {
        &__list {
          @apply pt-8;
          @apply grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgSelectionComponent implements OnInit {
  orgs = [1, 2, 3];
  constructor() {}

  ngOnInit(): void {}
}
