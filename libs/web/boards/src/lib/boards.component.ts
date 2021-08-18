import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Board, BoardList, BoardListWithTasks, DataLoading, Task, User } from '@compito/api-interfaces';
import { TasksCreateModalComponent } from '@compito/web/tasks';
import { Breadcrumb, formatUser } from '@compito/web/ui';
import { UsersAction, UsersState } from '@compito/web/users/state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import produce from 'immer';
import { TaskDetailModalComponent } from 'libs/web/tasks/src/lib/shared/components/task-detail-modal/task-detail-modal.component';
import { forkJoin, Observable } from 'rxjs';
import { filter, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { BoardsAction } from './state/boards.actions';
import { BoardsState } from './state/boards.state';
@Component({
  selector: 'compito-boards',
  template: `
    <compito-page-header
      [title]="(board$ | async)?.name"
      [loading]="(loading$ | async)?.type === 'LOADING'"
      [breadcrumbs]="breadcrumbs"
    >
    </compito-page-header>
    <ng-container [ngSwitch]="(loading$ | async)?.type">
      <ng-container *ngSwitchCase="'LOADING'">
        <div class="grid place-items-center" style="min-height:calc(100vh - 64px - 64px)">
          <div class="text-center -translate-y-8 transform">
            <img src="assets/images/loading.svg" alt="Loading" width="300px" height="300px" />
            <h1 class="text-md font-medium">Please wait...</h1>
            <p class="text-gray-600">Your board is being loaded!</p>
          </div>
        </div>
      </ng-container>
      <ng-container *ngSwitchCase="'SUCCESS'">
        <ng-container *ngIf="lists$ | async as lists">
          <section
            class="board__container p-8 flex space-x-2"
            cdkDropList
            [cdkDropListData]="lists"
            cdkDropListOrientation="horizontal"
            (cdkDropListDropped)="drop($event)"
          >
            <ng-container *ngFor="let item of lists">
              <compito-task-list
                cdkDrag
                [list]="item"
                [allList]="lists"
                (dropped)="dropTask($event)"
                (newTask)="createNewTask($event)"
                (taskClicked)="viewTaskDetail($event, item)"
              >
                <div class="absolute flex justify-center left-0 top-0 w-full rounded-tl-md rounded-tr-md">
                  <div
                    cdkDragHandle
                    class="list__drag transition-opacity duration-300 ease-in opacity-0 w-8 h-8 -mt-4 grid cursor-move place-items-center bg-gray-100 rounded-full"
                  >
                    <rmx-icon style="width: 20px; height:20px" name="drag-move-line"></rmx-icon>
                  </div>
                </div>
              </compito-task-list>
            </ng-container>
          </section>
        </ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'ERROR'"> </ng-container>
    </ng-container>
  `,
  styles: [
    `
      .board {
        &__container {
          @apply overflow-x-auto;
          min-height: calc(100vh - var(--header-height) - 65px);
        }
      }

      compito-task-list:hover {
        .list-drag {
          @apply opacity-100;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', link: '/' },
    { label: 'Projects', link: '/projects' },
  ];

  @Select(BoardsState.getBoard)
  board$!: Observable<Board | null>;

  @Select(BoardsState.getBoardLists)
  lists$!: Observable<BoardListWithTasks[]>;

  @Select(BoardsState.loading)
  loading$!: Observable<DataLoading>;

  @Select(UsersState.getAllUsers)
  users$!: Observable<User[]>;

  constructor(
    private dialog: DialogService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.taskId) {
      forkJoin([
        this.store.dispatch(new BoardsAction.Get(this.boardId)),
        this.store.dispatch(new UsersAction.GetAll({})),
      ])
        .pipe(
          withLatestFrom(this.board$, this.lists$),
          tap(([, board, lists]) => {
            if (board?.tasks && board?.tasks?.length > 0 && lists) {
              const task = board?.tasks.find(({ id }) => id === this.taskId);
              const list = lists.find(({ id }) => id === task?.list);
              task && list && this.viewTaskDetail(task, list);
            }
          }),
        )
        .subscribe();
    } else {
      this.store.dispatch(new BoardsAction.Get(this.boardId));
      this.store.dispatch(new UsersAction.GetAll({}));
    }
    this.board$
      .pipe(
        filter((data) => data != null),
        map((data) => (data ? { link: `/projects/${data.project.id}`, label: data.project.name } : null)),
        take(1),
      )
      .subscribe((data: Breadcrumb | null) => {
        data && this.breadcrumbs.push(data);
      });
  }

  drop(event: CdkDragDrop<BoardListWithTasks[]>) {
    const reOrdered = produce(event.container.data, (draft) => {
      moveItemInArray(draft, event.previousIndex, event.currentIndex);
    });
    this.store.dispatch(new BoardsAction.Reorder(this.boardId, reOrdered));
  }

  dropTask(event: CdkDragDrop<Task[]>) {
    const { previousContainer, container, previousIndex, currentIndex } = event;
    if (previousContainer === container) {
      this.store.dispatch(new BoardsAction.MoveTaskWithList(container.id, previousIndex, currentIndex));
    } else {
      const { previousContainer, container, previousIndex, currentIndex } = event;
      this.store.dispatch(
        new BoardsAction.MoveTaskToOtherList(
          previousContainer.id,
          container.id,
          previousIndex,
          currentIndex,
          previousContainer.data[previousIndex]?.id,
        ),
      );
    }
  }

  createNewTask(listId: string) {
    const ref = this.dialog.open(TasksCreateModalComponent);
    ref.afterClosed$
      .pipe(withLatestFrom(this.board$, this.auth.user$.pipe(formatUser())))
      .subscribe(([data, board, user]) => {
        if (data) {
          this.store.dispatch(
            new BoardsAction.AddTask({
              ...data,
              list: listId,
              boardId: board?.id,
              projectId: board?.project.id,
              orgId: user?.org,
            }),
          );
        }
      });
  }

  viewTaskDetail(task: Task, list: BoardList) {
    const ref = this.dialog.open(TaskDetailModalComponent, {
      size: 'lg',
      data: {
        task,
        list,
        users: this.users$,
      },
    });
    return ref;
  }

  private get boardId() {
    return this.activatedRoute.snapshot.params?.id ?? null;
  }
  private get taskId() {
    return this.activatedRoute.snapshot.params?.taskId ?? null;
  }
}
