import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BoardList, CardEvent, DataLoading, DataLoadingState, Task, User, UserDetails } from '@compito/api-interfaces';
import { UserAvatarGroupData, userMapToArray } from '@compito/web/ui';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BoardsService } from '../../../boards.service';
import { BoardsAction } from '../../../state/boards.actions';
@Component({
  selector: 'compito-task-detail-modal',
  templateUrl: './task-detail-modal.component.html',
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
export class TaskDetailModalComponent implements OnInit, AfterViewInit {
  selectedAssignees = new Map<string, User>();
  assignedUsersSubject = new BehaviorSubject<UserAvatarGroupData[]>([]);
  assignedUsers$ = this.assignedUsersSubject.asObservable();

  description = new FormControl('Default description');
  priority = new FormControl('');
  comment = new FormControl('', [Validators.minLength(2)]);
  initialValues = {
    description: '',
  };

  taskDetail: Task | null = null;
  isScrolledSubject = new BehaviorSubject(false);
  loadingState$ = new BehaviorSubject<DataLoading>({ type: DataLoadingState.init });
  @ViewChild('contentContainer') contentContainer: ElementRef<HTMLDivElement> | null = null;

  constructor(
    public ref: DialogRef<{
      taskId: string;
      list: BoardList;
      user$: Observable<UserDetails | null>;
      users$: Observable<User[]>;
      priorities$: Observable<string[]>;
    }>,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private boardService: BoardsService,
  ) {}

  ngOnInit(): void {
    this.loadingState$.next({ type: DataLoadingState.loading });
    this.boardService.getTask(this.ref.data?.taskId).subscribe(
      (task) => {
        this.taskDetail = task;
        const assignees = task?.assignees ?? [];
        this.description.setValue(task.description ?? '');
        this.priority.setValue(task.priority ?? '');
        this.initialValues.description = task.description ?? '';
        assignees.forEach((assignee) => {
          this.selectedAssignees.set(assignee.id, assignee);
        });
        this.assignedUsersSubject.next(userMapToArray(this.selectedAssignees));
        this.loadingState$.next({ type: DataLoadingState.success });
      },
      () => {
        this.loadingState$.next({ type: DataLoadingState.success });
      },
    );
    this.priority.valueChanges
      .pipe(
        switchMap((priority) =>
          this.store.dispatch(new BoardsAction.UpdateTaskPriority(this.taskId, priority, this.listId)),
        ),
      )
      .subscribe();
  }
  ngAfterViewInit() {
    if (this.contentContainer) {
      this.contentContainer.nativeElement.addEventListener('scroll', (event: Event) => {
        const { scrollTop } = event.target as HTMLDivElement;
        this.isScrolledSubject.next(scrollTop > 50);
      });
    }
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
  clearCommentField() {
    this.comment.setValue('');
    this.comment.markAsPristine();
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

  addComment() {
    if (this.comment.valid) {
      this.boardService.addComment(this.taskId, this.comment.value).subscribe((data) => {
        this.taskDetail = produce(this.taskDetail, (draft) => {
          draft?.comments.push(data);
        });
        this.clearCommentField();
        this.cdr.markForCheck();
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
    return this.taskDetail?.id as string;
  }
  private get listId() {
    return this.ref.data.list.id;
  }
}
