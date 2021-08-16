import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Task } from '@compito/api-interfaces';

@Component({
  selector: 'compito-task-list',
  template: `
    <div>
      <compito-section-header [title]="title"></compito-section-header>
      <ul *ngIf="data && data.length > 0" class="shadow-sm rounded-md border">
        <li
          *ngFor="let task of data"
          class="border-b p-2 group first:rounded-t-md last:rounded-b-md last:border-b-0 bg-white cursor-pointer hover:bg-gray-50 transition-all duration-200"
          [routerLink]="['/boards', task.board.id, 'tasks', task.id]"
        >
          <header>
            <p class="group-hover:text-primary">
              {{ task?.title }}
            </p>
          </header>
          <footer class="flex items-center justify-between text-xs text-gray-400 mt-2">
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
