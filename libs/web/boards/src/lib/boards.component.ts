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
    <section class="board__container p-8 bg-white flex space-x-2">
      <ng-container *ngFor="let item of list">
        <compito-task-list
          [list]="item"
          [allList]="list"
          (dropped)="drop($event)"
        ></compito-task-list>
      </ng-container>
    </section>
  `,
  styles: [
    `
      .board {
        &__container {
          min-height: calc(100vh - var(--header-height) - 65px);
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
