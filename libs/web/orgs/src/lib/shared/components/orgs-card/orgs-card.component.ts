import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Organization } from '@compito/api-interfaces';
@Component({
  selector: 'compito-orgs-card',
  template: `<article
      *ngIf="data"
      class="p-4 relative rounded-md border transition-all hover:shadow-lg duration-200 ease-in
      border-gray-100 bg-white shadow-sm hover:border-gray-200"
    >
      <button
        [tippy]="moreOptions"
        placement="bottom-start"
        variation="menu"
        class="absolute z-10 top-3 right-3 text-gray-500 hover:bg-gray-100 p-1 rounded-md"
      >
        <rmx-icon class="icon-xs" name="more-2-fill"></rmx-icon>
      </button>
      <header class="flex items-center justify-between">
        <div>
          <div class="flex items-center justify-between">
            <p class="text-md font-medium cursor-pointer hover:text-primary" [routerLink]="['/orgs', data.id]">
              {{ data?.name }}
            </p>
          </div>
        </div>
      </header>
      <div class="my-4">
        <compito-user-avatar-group [data]="[]"></compito-user-avatar-group>
      </div>
      <footer class="flex items-center justify-between text-xs text-gray-400 mt-4">
        <p>
          Created
          <span class="font-medium text-gray-600">{{ data?.createdAt | timeAgo }}</span>
        </p>
        <p>
          Projects
          <span class="font-medium text-gray-600">19</span>
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
export class OrgsCardComponent implements OnInit {
  @Input() data: Organization | null = null;
  constructor() {}

  ngOnInit(): void {}
}
