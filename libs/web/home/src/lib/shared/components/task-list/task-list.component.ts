import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Task } from '@compito/api-interfaces';

@Component({
  selector: 'compito-task-list',
  template: `
    <div>
      <h3 class="mb-4 text-lg font-medium">{{ title }}</h3>
      <ul *ngIf="data && data.length > 0" class="shadow-md rounded-md border">
        <li
          *ngFor="let task of data"
          class="border-b p-2 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-all duration-200"
          [routerLink]="['/boards', task.board.id, 'tasks', task.id]"
        >
          <header>
            <p class="">
              {{ task?.title }}
            </p>
          </header>
          <footer class="flex items-center justify-between text-xs text-gray-400 mt-4">
            <p>
              Updated
              <span class="text-gray-600">{{ task?.updatedAt | timeAgo }}</span>
            </p>
            <p>
              <span class="font-medium text-gray-600" [priorityColor]="task.priority">{{ task?.priority }}</span>
              Priority
            </p>
          </footer>
        </li>
      </ul>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  @Input() data: Task[] | null = [];
  @Input() title = 'Tasks';
  constructor() {}

  ngOnInit(): void {}
}
