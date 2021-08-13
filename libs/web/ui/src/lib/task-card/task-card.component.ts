import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '@compito/api-interfaces';
import { UserAvatarGroupData } from '../user-avatar-group';

@Component({
  selector: 'compito-task-card',
  template: `
    <div
      class="bg-white rounded-md px-4 py-2 shadow-sm border hover:shadow-md"
      *ngIf="task"
      (click)="clicked.emit(task)"
    >
      <header>
        <p class="font-medium text-sm line-clamp-1">{{ task?.title }}</p>
      </header>
      <div>
        <p class="text-xs text-gray-500 line-clamp-2">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.sit amet consectetur adipisicing elit.
        </p>
      </div>
      <footer class="flex items-center justify-between mt-4 text-gray-500" [style.minHeight.px]="33">
        <div>
          <compito-user-avatar-group [data]="assignees" [size]="25"></compito-user-avatar-group>
        </div>
        <div class="footer__meta flex items-center space-x-4 text-xs">
          <div class="flex items-center space-x-1">
            <rmx-icon class="icon-xs" name="message-3-line"></rmx-icon>
            <p>{{ task?.comments?.length ?? 0 }}</p>
          </div>
          <div class="flex items-center space-x-1">
            <rmx-icon class="icon-xs" name="attachment-2"></rmx-icon>
            <p>7</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() assignees: UserAvatarGroupData[] = [];

  @Output() clicked = new EventEmitter<Task>();
  constructor() {}

  ngOnInit(): void {}
}
