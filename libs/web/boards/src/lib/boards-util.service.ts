import { Injectable } from '@angular/core';
import { BoardListTasksGrouped, Task } from '@compito/api-interfaces';
import groupBy from 'lodash.groupby';
@Injectable({
  providedIn: 'root',
})
export class BoardsUtilService {
  getTasksGroupedByList(tasks: Task[]): BoardListTasksGrouped {
    if (tasks?.length > 0) {
      return groupBy(tasks, 'list');
    }
    return {};
  }
}
