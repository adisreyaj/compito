import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'compito-task-list',
  template: `<div
    cdkDropList
    [cdkDropListData]="list.data"
    [id]="list.name"
    [cdkDropListConnectedTo]="list.name | dropListConnection: allList"
    (cdkDropListDropped)="dropped.emit($event)"
    class="task-list relative bg-gray-100 rounded-md transition-all duration-200 ease-in p-4"
  >
    <ng-content></ng-content>
    <header class="flex items-center justify-between sticky top-0">
      <p class="font-medium">{{ list?.name }}</p>
      <button
        class="text-gray-500 bg-white border rounded-md shadow-sm hover:shadow-md"
      >
        <rmx-icon class="w-5 h-5" name="add-line"></rmx-icon>
      </button>
    </header>
    <ul
      *ngIf="list.data.length > 0; else noTask"
      class="task-list__container space-y-4 mt-4 -mx-4 px-4"
    >
      <ng-container *ngFor="let task of list.data">
        <article cdkDrag class="task-card cursor-pointer">
          <compito-task-card [task]="task"></compito-task-card>
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
          @apply bg-gray-200 ring ring-gray-300;
          .no-task {
            @apply hidden;
          }
        }
      }
      .task-list__container {
        @apply overflow-y-auto;
        max-height: calc(100vh - var(--header-height) - 65px - 140px);
      }
      .task-card.cdk-drag-preview {
        @apply shadow-xl;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  @Input() list: any = null;
  @Input() allList: any[] = [];

  @Output() dropped = new EventEmitter();
}
