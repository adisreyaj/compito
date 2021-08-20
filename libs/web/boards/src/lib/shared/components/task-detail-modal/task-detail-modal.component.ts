import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BoardList, CardEvent, Task, User } from '@compito/api-interfaces';
import { UserAvatarGroupData, userMapToArray } from '@compito/web/ui';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BoardsAction } from '../../../state/boards.actions';
@Component({
  selector: 'compito-task-detail-modal',
  template: `
    <div class="p-4 flex flex-col">
      <header class="mb-4">
        <div>
          <p class="font-medium text-gray-600 text-lg">{{ ref.data.task?.title }}</p>
        </div>
        <div class="text-xs text-gray-500 flex items-center space-x-4 py-2">
          <p>
            List: <span class="text-gray-800 text-sm">{{ ref.data.list?.name }}</span>
          </p>
          <p>
            Created By: <span class="text-gray-800 text-sm">{{ ref.data.task?.createdBy?.firstName }}</span>
          </p>
          <p>
            Created: <span class="text-gray-800 text-sm">{{ ref.data.task?.createdAt | timeAgo }}</span>
          </p>
        </div>
      </header>
      <div>
        <section class="task-detail__section">
          <ng-container *ngTemplateOutlet="sectionHeader; context: { $implicit: 'Assignees' }"></ng-container>
          <div class="flex items-center">
            <compito-user-avatar-group [data]="assignedUsers$ | async"></compito-user-avatar-group>
            <div [style.height.px]="48" [style.width.px]="48" class="p-1">
              <button
                type="button"
                class="btn btn--primary rounded-full outline-none w-full h-full bg-primary-gradient cursor-pointer flex justify-center items-center text-white"
                [style.marginLeft.rem]="0.3"
                [tippy]="addAssignees"
                [zIndex]="9999"
                placement="bottom-start"
                variation="menu"
              >
                <rmx-icon name="add-line"></rmx-icon>
              </button>
            </div>
          </div>
        </section>
        <section class="task-detail__section">
          <ng-container *ngTemplateOutlet="sectionHeader; context: { $implicit: 'Priority' }"></ng-container>
          <div class="form-group">
            <select name="priority" id="priority" [formControl]="priority">
              <ng-container *ngFor="let priority of priorities | async">
                <option [value]="priority">{{ priority }}</option>
              </ng-container>
            </select>
          </div>
        </section>
        <section class="task-detail__section">
          <ng-container *ngTemplateOutlet="sectionHeader; context: { $implicit: 'Description' }"></ng-container>
          <div class="form-group">
            <textarea class="w-3/4" type="text" id="description" rows="3" [formControl]="description"></textarea>
            <footer class="mt-4 flex items-center space-x-2">
              <button btn size="sm" [disabled]="!description.dirty" (click)="updateDescription()">Save</button>
              <button btn size="sm" variant="secondary" *ngIf="description.dirty">Cancel</button>
            </footer>
          </div>
        </section>
        <section class="task-detail__section">
          <ng-container *ngTemplateOutlet="sectionHeader; context: { $implicit: 'Attachments' }"></ng-container>
          <p>No attachments found</p>
        </section>
        <section class="task-detail__section">
          <ng-container *ngTemplateOutlet="sectionHeader; context: { $implicit: 'Comments' }"></ng-container>
          <ul>
            <li>
              <div class="flex items-start space-x-4">
                <div>
                  <img [src]="" [alt]="" width="30" height="30" class="rounded-full" />
                </div>
                <div class="form-group">
                  <textarea class="w-3/4" type="text" id="comment" [formControl]="comment" rows="2"></textarea>
                  <footer class="mt-4 flex items-center space-x-2">
                    <button btn size="sm" [disabled]="!comment.dirty">Save</button>
                    <button btn size="sm" variant="secondary" *ngIf="comment.dirty">Cancel</button>
                  </footer>
                </div>
              </div>
            </li>
            <ng-container *ngFor="let comment of ref.data.task?.comments">
              <li>
                <div class="flex items-start space-x-4">
                  <div>
                    <img [src]="comment.createdBy.image" [alt]="comment.createdBy.firstName" />
                  </div>
                  <div>
                    <p>{{ comment.content }}</p>
                  </div>
                </div>
              </li>
            </ng-container>
          </ul>
        </section>
      </div>
    </div>

    <ng-template #sectionHeader let-title>
      <h4 class="text-gray-500 text-md font-medium mb-2">{{ title }}</h4>
    </ng-template>

    <ng-template #addAssignees let-hide>
      <compito-user-select
        [hide]="hide"
        [users]="ref.data.users$ | async"
        [selectedMembers]="selectedAssignees"
        (clicked)="handleUserSelectEvent($event, hide)"
      ></compito-user-select>
    </ng-template>
  `,
  styles: [
    `
      .task-detail {
        &__section {
          &:not(:last-child) {
            @apply mb-6;
          }
        }
      }
    `,
  ],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0, transform: 'translateY(-10px)' }))]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailModalComponent implements OnInit {
  selectedAssignees = new Map<string, User>();
  assignedUsersSubject = new BehaviorSubject<UserAvatarGroupData[]>([]);
  assignedUsers$ = this.assignedUsersSubject.asObservable();

  description = new FormControl('Default description');
  priority = new FormControl('');
  comment = new FormControl('');
  initialValues = {
    description: '',
  };

  constructor(
    public ref: DialogRef<{
      task: Task;
      list: BoardList;
      users$: Observable<User[]>;
      priorities$: Observable<string[]>;
    }>,
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const assignees = this.ref.data?.task?.assignees ?? [];
    this.description.setValue(this.ref.data.task.description ?? '');
    this.priority.setValue(this.ref.data.task.priority ?? '');
    this.initialValues.description = this.ref.data.task.description ?? '';
    assignees.forEach((assignee) => {
      this.selectedAssignees.set(assignee.id, assignee);
    });
    this.assignedUsersSubject.next(userMapToArray(this.selectedAssignees));
    this.priority.valueChanges
      .pipe(
        switchMap((priority) =>
          this.store.dispatch(new BoardsAction.UpdateTaskPriority(this.taskId, priority, this.listId)),
        ),
      )
      .subscribe();
  }

  updateAssignees() {
    const assignees = [...this.selectedAssignees.keys()];
    this.store.dispatch(new BoardsAction.UpdateAssignees(this.listId, this.taskId, assignees));
    this.assignedUsersSubject.next(userMapToArray(this.selectedAssignees));
  }

  updateDescription() {
    if (this.description.valid) {
      const newValue = this.description.value;
      this.store
        .dispatch(new BoardsAction.UpdateTaskDescription(this.taskId, this.description.value, this.listId))
        .subscribe(() => {
          this.description.markAsPristine();
          this.initialValues.description = newValue;
          this.cdr.markForCheck();
        });
    }
  }

  revertDescription() {
    this.description.setValue(this.initialValues.description);
    this.description.markAsPristine();
  }

  toggleAssignee(user: User) {
    if (this.selectedAssignees.has(user.id)) {
      this.selectedAssignees = produce(this.selectedAssignees, (draft) => {
        draft.delete(user.id);
      });
    } else {
      this.selectedAssignees = produce(this.selectedAssignees, (draft) => {
        draft.set(user.id, user);
      });
    }
  }

  handleUserSelectEvent({ type, payload }: CardEvent, hide: () => void) {
    switch (type) {
      case 'toggle':
        this.toggleAssignee(payload);
        break;
      case 'save':
        this.updateAssignees();
        hide();
        break;
    }
  }
  get priorities() {
    return this.ref.data.priorities$ as Observable<string[]>;
  }

  private get taskId() {
    return this.ref.data.task.id;
  }
  private get listId() {
    return this.ref.data.list.id;
  }
}
