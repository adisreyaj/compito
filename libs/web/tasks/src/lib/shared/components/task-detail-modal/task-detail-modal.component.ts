import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BoardList, Task, User } from '@compito/api-interfaces';
import { BoardsAction } from '@compito/web/boards/state';
import { UserAvatarGroupData } from '@compito/web/ui';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';
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
              <div
                class="rounded-full w-full h-full bg-primary-gradient cursor-pointer flex justify-center items-center text-white"
                [style.marginLeft.rem]="0.3"
                [tippy]="addAssignees"
                [zIndex]="9999"
                placement="bottom-start"
                variation="menu"
              >
                <rmx-icon name="add-line"></rmx-icon>
              </div>
            </div>
          </div>
        </section>
        <section class="task-detail__section">
          <ng-container *ngTemplateOutlet="sectionHeader; context: { $implicit: 'Description' }"></ng-container>
          <div class="form-group">
            <textarea class="w-3/4" type="text" id="description" rows="3" [formControl]="description"></textarea>
            <footer class="mt-4 flex items-center space-x-2">
              <button btn size="sm" [disabled]="!description.dirty" (click)="updateDescription()">Save</button>
              <button btn size="sm" variant="secondary">Cancel</button>
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
                    <button btn size="sm" variant="secondary">Cancel</button>
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
      <div class="flex flex-col w-64 p-1" cdkTrapFocus>
        <div class="form-group mb-0">
          <input type="text" class="w-full" autofocus />
        </div>
        <ul class="space-y-2 max-h-60 overflow-y-auto">
          <ng-container *ngFor="let user of ref.data.users | async">
            <li
              class="flex space-x-2 items-center rounded-md p-2 hover:bg-gray-100 cursor-pointer"
              (click)="toggleAssignee(user)"
            >
              <div>
                <ng-container *ngIf="!selectedAssignees.has(user.id); else userAdded">
                  <img
                    [src]="user?.image ?? 'https://avatar.tobi.sh/' + user.email"
                    [alt]="user.firstName"
                    width="40"
                    height="40"
                    class="rounded-full"
                  />
                </ng-container>
                <ng-template #userAdded>
                  <div
                    class="bg-primary-translucent text-primary rounded-full grid place-items-center"
                    [style.height.px]="40"
                    [style.width.px]="40"
                  >
                    <rmx-icon name="check-line"></rmx-icon>
                  </div>
                </ng-template>
              </div>
              <div>
                <p>
                  {{ user.firstName }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ user.email }}
                </p>
              </div>
            </li>
          </ng-container>
        </ul>
        <footer class="flex pt-2 items-center space-x-2">
          <button btn size="sm" (click)="updateAssignees(); hide()">Save</button>
          <button btn size="sm" variant="secondary" (click)="hide()">Cancel</button>
        </footer>
      </div>
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
  comment = new FormControl('');

  constructor(
    public ref: DialogRef<{
      task: Task;
      list: BoardList;
      users: Observable<User[]>;
    }>,
    private store: Store,
  ) {}

  ngOnInit(): void {
    const assignees = this.ref.data?.task?.assignees ?? [];
    this.description.setValue(this.ref.data.task.description ?? '');
    assignees.forEach((assignee) => {
      this.selectedAssignees.set(assignee.id, assignee);
    });
    this.assignedUsersSubject.next(this.mapToArray(this.selectedAssignees));
  }

  updateAssignees() {
    const assignees = [...this.selectedAssignees.keys()];
    this.store.dispatch(new BoardsAction.UpdateAssignees(this.listId, this.taskId, assignees));
    this.assignedUsersSubject.next(this.mapToArray(this.selectedAssignees));
  }

  updateDescription() {
    if (this.description.valid) {
      this.store.dispatch(new BoardsAction.UpdateTaskDescription(this.taskId, this.description.value));
    }
  }

  mapToArray(map: Map<any, User>) {
    return [...map.values()].map(({ email, image, firstName }) => {
      return {
        image: image ?? `https://avatar.tobi.sh/${email}`,
        name: firstName,
      };
    });
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

  private get taskId() {
    return this.ref.data.task.id;
  }
  private get listId() {
    return this.ref.data.list.id;
  }
}
