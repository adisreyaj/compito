import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardListWithTasks, Task } from '@compito/api-interfaces';
@Component({
  selector: 'compito-task-list',
  template: `<div
    *ngIf="list"
    cdkDropList
    [cdkDropListData]="list.tasks"
    [id]="list.id"
    [cdkDropListConnectedTo]="list.id | dropListConnection: allList"
    (cdkDropListDropped)="dropped.emit($event)"
    class="task-list relative h-full border-2 border-transparent border-dashed bg-gray-50 rounded-md transition-all duration-200 ease-in p-4"
  >
    <ng-content></ng-content>
    <header class="flex items-center justify-between sticky top-0 mb-4">
      <p class="font-medium">{{ list?.name }}</p>
      <button
        (click)="newTask.emit(list.id)"
        class="text-gray-500 bg-white border rounded-md shadow-sm hover:shadow-md"
      >
        <rmx-icon class="w-5 h-5" name="add-line"></rmx-icon>
      </button>
    </header>
    <ul *ngIf="list.tasks.length > 0; else noTask" class="task-list__container space-y-4 -mx-4 px-4 pb-2">
      <ng-container *ngFor="let task of list.tasks">
        <article cdkDrag class="task-card cursor-pointer">
          <compito-task-card
            [task]="task"
            [assignees]="task.assignees | usersToAvatarGroup"
            (clicked)="taskClicked.emit($event)"
          ></compito-task-card>
        </article>
      </ng-container>
    </ul>
    <ng-template #noTask>
      <div class="no-task mt-4">
        <p class="text-sm text-gray-400">No tasks available</p>
      </div>
    </ng-template>
  </div>`,
  styles: [
    `
      :host.cdk-drag-preview {
        .task-list {
          @apply shadow-xl;
        }
      }
      .task-list {
        width: 300px;
        &.cdk-drop-list-dragging {
          @apply bg-gray-100 border-primary border-2;
          .task-list__container {
            /* @apply opacity-0; */
          }
          .no-task {
            @apply hidden;
          }
        }
      }
      .task-list__container {
        @apply overflow-y-auto;
        max-height: calc(100vh - var(--header-height) - 64px - 140px);
      }
      .task-card.cdk-drag-preview {
        @apply shadow-xl;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  @Input() list: BoardListWithTasks | null = null;
  @Input() allList: any[] = [];

  @Output() dropped = new EventEmitter();
  @Output() newTask = new EventEmitter<string>();
  @Output() taskClicked = new EventEmitter<Task>();
}
