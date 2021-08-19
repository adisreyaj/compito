import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Task } from '@compito/api-interfaces';

@Component({
  selector: 'compito-my-task-card',
  template: `<article
    *ngIf="data"
    class="p-4 relative rounded-md border transition-all hover:shadow-md duration-200 ease-in
      border-gray-100 bg-white shadow-sm hover:border-gray-200"
  >
    <div
      *ngIf="data.completed"
      tippy="Completed"
      class="absolute z-10 top-3 right-3 text-white bg-primary rounded-full"
    >
      <rmx-icon class="icon-xxs" name="check-line"></rmx-icon>
    </div>
    <header>
      <p
        class="cursor-pointer hover:text-primary line-clamp-1"
        [routerLink]="['/boards', data.board.id, 'tasks', data.id]"
      >
        {{ data?.title }}
      </p>
      <p class="text-sm text-gray-500">
        <span class="cursor-pointer hover:text-primary" [routerLink]="['/projects', data.project.id]">{{
          data?.project?.name
        }}</span>
        <span class="mx-1">></span>
        <span class="cursor-pointer hover:text-primary" [routerLink]="['/boards', data.board.id]">{{
          data?.board?.name
        }}</span>
      </p>
    </header>
    <footer class="flex items-center justify-between text-xs text-gray-400 mt-4">
      <p>
        Updated
        <span class="font-medium text-gray-600">{{ data?.updatedAt | timeAgo }}</span>
      </p>
      <p>
        <span class="font-medium text-gray-600" [priorityColor]="data.priority">{{ data?.priority }}</span>
        Priority
      </p>
    </footer>
  </article>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTaskCardComponent implements OnInit {
  @Input() data: Task | null = null;
  constructor() {}

  ngOnInit(): void {}
}
