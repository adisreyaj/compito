import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
@Component({
  selector: 'compito-boards',
  template: `
    <compito-page-header title="Compito UI"> </compito-page-header>
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
        >
          <div
            class="absolute flex justify-center left-0 top-0 w-full rounded-tl-md rounded-tr-md"
          >
            <div
              cdkDragHandle
              class="list__drag transition-opacity duration-300 ease-in opacity-0 w-8 h-8 -mt-4 grid cursor-move place-items-center bg-gray-100 rounded-full"
            >
              <rmx-icon
                style="width: 20px; height:20px"
                name="drag-move-line"
              ></rmx-icon>
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
          /* min-height: calc(100vh - var(--header-height) - 64px); */
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
  constructor() {}

  ngOnInit(): void {}

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
