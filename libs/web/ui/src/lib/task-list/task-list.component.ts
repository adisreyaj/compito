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
    class="task-list bg-gray-100 rounded-md transition-all duration-200 ease-in py-4"
    cdkDropList
    [cdkDropListData]="list.data"
    [id]="list.name"
    [cdkDropListConnectedTo]="list.name | dropListConnection: allList"
    (cdkDropListDropped)="dropped.emit($event)"
  >
    <header class="flex items-center justify-between sticky top-0 px-4">
      <p class="font-medium">{{ list?.name }}</p>
      <button
        class="text-gray-500 bg-white border rounded-md shadow-sm hover:shadow-md"
      >
        <rmx-icon class="w-5 h-5" name="add-line"></rmx-icon>
      </button>
    </header>
    <ul class="task-list__container space-y-4 px-4 mt-4">
      <ng-container *ngFor="let task of list.data">
        <article cdkDrag class="task-card cursor-pointer">
          <compito-task-card [task]="task"></compito-task-card>
        </article>
      </ng-container>
    </ul>
  </div>`,
  styles: [
    `
      .task-list {
        width: 300px;
        &.cdk-drop-list-dragging {
          @apply bg-gray-200 ring ring-gray-300;
        }
        &__placeholder {
          @apply bg-gray-400;
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
