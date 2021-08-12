import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Board, BoardListWithTasks, Task } from '@compito/api-interfaces';
import { TasksCreateModalComponent } from '@compito/web/tasks';
import { Breadcrumb } from '@compito/web/ui';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import produce from 'immer';
import { Observable } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { BoardsAction } from './state/boards.actions';
import { BoardsState } from './state/boards.state';
@Component({
  selector: 'compito-boards',
  template: `
    <compito-page-header [title]="(board$ | async)?.name" [breadcrumbs]="breadcrumbs"> </compito-page-header>
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

  constructor(private dialog: DialogService, private store: Store, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(new BoardsAction.Get(this.boardId));

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
    ref.afterClosed$.pipe(withLatestFrom(this.board$)).subscribe(([data, board]) => {
      if (data) {
        this.store.dispatch(
          new BoardsAction.AddTask({ ...data, list: listId, boardId: board?.id, projectId: board?.project.id }),
        );
      }
    });
  }

  private get boardId() {
    return this.activatedRoute.snapshot.params?.id ?? null;
  }
}
