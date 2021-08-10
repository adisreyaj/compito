import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Board } from '@compito/api-interfaces';
import { TasksCreateModalComponent } from '@compito/web/tasks';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { BoardsAction } from './state/boards.actions';
import { BoardsState } from './state/boards.state';
@Component({
  selector: 'compito-boards',
  template: `
    <compito-page-header [title]="(board$ | async)?.name"> </compito-page-header>
    <section
      class="board__container p-8 flex space-x-2"
      cdkDropList
      [cdkDropListData]="list"
      cdkDropListOrientation="horizontal"
      (cdkDropListDropped)="drop($event)"
    >
      <ng-container *ngFor="let item of list">
        <compito-task-list
          cdkDrag
          [list]="item"
          [allList]="list"
          (dropped)="drop($event)"
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
  `,
  styles: [
    `
      .board {
        &__container {
          @apply overflow-x-auto;
          min-height: calc(100vh - var(--header-height) - 64px);
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
  list = [
    {
      name: 'To Do',
      data: ['Test', 'Foo', 'Bar'],
    },
    {
      name: 'In Progress',
      data: ['Test', 'Foo', 'Bar'],
    },
    {
      name: 'Done',
      data: ['Test', 'Foo', 'Bar'],
    },
    {
      name: 'Deployed',
      data: [],
    },
  ];

  @Select(BoardsState.getBoard)
  board$!: Observable<Board | null>;
  constructor(private dialog: DialogService, private store: Store, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(new BoardsAction.Get(this.boardId));
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
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
