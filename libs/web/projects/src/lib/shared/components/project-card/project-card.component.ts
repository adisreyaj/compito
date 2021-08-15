import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Project } from '@compito/api-interfaces';

@Component({
  selector: 'compito-project-card',
  template: `
    <article
      *ngIf="data"
      class="p-4 rounded-md border transition-all hover:shadow-lg duration-200 ease-in
      border-gray-100 bg-white shadow-sm hover:border-gray-200"
    >
      <header class="flex items-center justify-between">
        <div>
          <div class="flex items-center justify-between">
            <p class="text-md font-medium cursor-pointer hover:text-primary" [routerLink]="['/projects', data.id]">
              {{ data?.name }}
            </p>
            <button [tippy]="moreOptions" placement="bottom-start" variation="menu" class="text-gray-500">
              <rmx-icon class="icon-xs" name="more-2-fill"></rmx-icon>
            </button>
          </div>
          <p class="text-gray-400 text-sm line-clamp-2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </header>
      <div class="my-4">
        <compito-user-avatar-group [data]="users"></compito-user-avatar-group>
      </div>
      <footer class="flex items-center justify-between text-xs text-gray-400 mt-4">
        <div>
          <p>
            Updated
            <span class="font-medium text-gray-600">{{ data?.updatedAt | timeAgo }}</span>
          </p>
        </div>
        <div>
          <p><span class="font-medium text-gray-600">19</span> Tasks</p>
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

  users = [
    {
      name: 'John Doe',
      image: 'https://avatar.tobi.sh/john',
    },
    {
      name: 'Jane Doe',
      image: 'https://avatar.tobi.sh/jane',
    },
    {
      name: 'Maicy Williams',
      image: 'https://avatar.tobi.sh/maicy',
    },
    {
      name: 'Patrick Jane',
      image: 'https://avatar.tobi.sh/patrick',
    },
    {
      name: 'Robert Jr',
      image: 'https://avatar.tobi.sh/robert',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
