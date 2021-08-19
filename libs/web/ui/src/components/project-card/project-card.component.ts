import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Project } from '@compito/api-interfaces';

@Component({
  selector: 'compito-project-card',
  template: `
    <article
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
          <p class="text-md font-medium cursor-pointer hover:text-primary" [routerLink]="['/projects', data.id]">
            {{ data?.name }}
          </p>
          <p class="text-gray-400 text-sm line-clamp-2" [style.minHeight.px]="40">{{ data?.description }}</p>
        </div>
      </header>
      <div class="my-4" [style.minHeight.px]="48">
        <compito-user-avatar-group [data]="data.members | usersToAvatarGroup"></compito-user-avatar-group>
      </div>
      <footer class="flex items-center justify-between text-xs text-gray-400 mt-4">
        <div>
          <p>
            Updated
            <span class="font-medium text-gray-600">{{ data?.updatedAt | timeAgo }}</span>
          </p>
        </div>
        <div>
          <p>
            <span class="font-medium text-gray-600">{{ data?.boards?.length }}</span> Boards
          </p>
        </div>
      </footer>
    </article>

    <ng-template #moreOptions let-hide>
      <div class="flex flex-col w-44">
        <div class="dropdown-item" (click)="hide()">Edit</div>
        <div class="text-red-600 dropdown-item" (click)="hide()">Delete</div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      header rmx-icon {
        width: 20px;
        height: 20px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent implements OnInit {
  @Input() data: Project | null = null;
  constructor() {}

  ngOnInit(): void {}
}
