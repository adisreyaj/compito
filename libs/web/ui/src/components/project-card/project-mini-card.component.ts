import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Project } from '@compito/api-interfaces';

@Component({
  selector: 'compito-project-mini-card',
  template: `
    <article
      *ngIf="data"
      [routerLink]="['/app/projects', data.id]"
      class="p-4 relative rounded-md border group cursor-pointer transition-all hover:shadow-lg duration-200 ease-in
      border-gray-100 bg-white shadow-sm hover:border-gray-200"
    >
      <header class="flex items-center justify-between">
        <div>
          <p class="text-md font-medium group-hover:text-primary">
            {{ data?.name }}
          </p>
          <p class="text-gray-400 text-sm line-clamp-1">{{ data?.description }}</p>
        </div>
      </header>
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
export class ProjectMiniCardComponent {
  @Input() data: Project | null = null;
}
