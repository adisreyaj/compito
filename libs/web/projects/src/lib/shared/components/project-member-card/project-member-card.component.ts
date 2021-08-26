import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@compito/api-interfaces';

@Component({
  selector: 'compito-project-member-card',
  template: `
    <article
      *ngIf="data"
      class="p-4 rounded-md border transition-all hover:shadow-lg duration-200 ease-in
      border-gray-100 bg-white shadow-sm hover:border-gray-200 relative"
    >
      <ng-container *permission="'project:update'">
        <button
          *ngIf="!disabled.includes(data.id)"
          [tippy]="moreOptions"
          placement="bottom-start"
          variation="menu"
          class="absolute z-10 top-3 right-3 text-gray-500 hover:bg-gray-100 p-1 rounded-md"
        >
          <rmx-icon class="icon-xs" name="more-2-fill"></rmx-icon>
        </button>
      </ng-container>
      <div class="flex space-x-2 items-center">
        <img
          [src]="data?.image ?? 'https://avatar.tobi.sh/' + data.email"
          [alt]="data?.firstName"
          width="50"
          height="50"
          class="rounded-full"
        />
        <div>
          <p class="text-md font-medium cursor-pointer hover:text-primary">
            {{ data?.firstName }} {{ data?.lastName }}
          </p>
          <p class="text-gray-400 text-sm line-clamp-2">{{ data?.email }}</p>
        </div>
      </div>
    </article>

    <ng-template #moreOptions let-hide>
      <div class="flex flex-col w-44">
        <div class="text-red-600 dropdown-item" (click)="removed.emit(data?.id); hide()">Remove</div>
      </div>
    </ng-template>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMemberCardComponent {
  @Input() data: User | null = null;
  @Input() disabled: any[] = [];

  @Output() removed = new EventEmitter<string>();
}
