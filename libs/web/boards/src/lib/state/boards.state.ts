import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { Board, BoardListWithTasks } from '@compito/api-interfaces';
import { ToastService } from '@compito/web/ui';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import produce from 'immer';
import sortBy from 'lodash.sortby';
import { tap } from 'rxjs/operators';
import { BoardsUtilService } from '../boards-util.service';
import { BoardsService } from '../boards.service';
import { BoardsAction } from './boards.actions';
export class BoardsStateModel {
  public board: Board | null = null;
  public lists: BoardListWithTasks[] = [];
}

const defaults: BoardsStateModel = {
  board: null,
  lists: [],
};

@State<BoardsStateModel>({
  name: 'boards',
  defaults,
})
@Injectable()
export class BoardsState {
  @Selector()
  static getBoard(state: BoardsStateModel) {
    return state.board;
  }
  @Selector()
  static getBoardLists(state: BoardsStateModel) {
    return state?.lists ?? [];
  }

  constructor(private boardService: BoardsService, private util: BoardsUtilService, private toast: ToastService) {}
  @Action(BoardsAction.Get)
  get({ patchState }: StateContext<BoardsStateModel>, { payload }: BoardsAction.Get) {
    return this.boardService.get(payload).pipe(
      tap((data) => {
        const groupedTasks = this.util.getTasksGroupedByList(data.tasks);
        const listsWithTasks = data.lists.map(
          (data) => ({ ...data, tasks: groupedTasks[data.id] ?? [] } as BoardListWithTasks),
        );
        patchState({ board: data, lists: listsWithTasks });
      }),
    );
  }
  @Action(BoardsAction.AddTask)
  addTask({ setState }: StateContext<BoardsStateModel>, { payload }: BoardsAction.AddTask) {
    return this.boardService.addTask(payload).pipe(
      tap(
        (data) => {
          setState(
            patch({
              lists: updateItem<BoardListWithTasks>(
                (list) => list?.id === payload.list,
                (list) => {
                  return produce(list, (draft) => {
                    draft.tasks.push(data);
                  });
                },
              ),
            }),
          );
          this.toast.success('Task added successfully!');
        },
        () => {
          this.toast.error('Failed to creat task!');
        },
      ),
    );
  }
  @Action(BoardsAction.UpdateAssignees)
  updateAssignees(
    { patchState, getState }: StateContext<BoardsStateModel>,
    { assignees, taskId, listId }: BoardsAction.UpdateAssignees,
  ) {
    return this.boardService.updateAssignees(taskId, assignees).pipe(
      tap(
        (data) => {
          const { lists } = getState();
          patchState({
            lists: produce(lists, (draft) => {
              const list = draft.find(({ id }) => id === listId);
              if (list) {
                const task = list.tasks.find(({ id }) => id === taskId);
                if (task) {
                  task.assignees = data.assignees;
                }
              }
            }),
          });
        },
        () => {
          this.toast.error('Failed to creat task!');
        },
      ),
    );
  }
  @Action(BoardsAction.UpdateTaskDescription)
  updateTaskDescription(
    { setState }: StateContext<BoardsStateModel>,
    { description, taskId }: BoardsAction.UpdateTaskDescription,
  ) {
    return this.boardService.updateDescription(taskId, description).pipe(
      tap(
        (data) => {},
        () => {
          this.toast.error('Failed to update task description!');
        },
      ),
    );
  }

  @Action(BoardsAction.MoveTaskToOtherList)
  moveTaskToOtherList(
    { patchState, getState }: StateContext<BoardsStateModel>,
    { from, to, currIndex, prevIndex, taskId }: BoardsAction.MoveTaskToOtherList,
  ) {
    const lists = getState().lists;
    const updatedLists = produce(lists, (draft) => {
      const fromList = draft.find(({ id }) => id === from);
      const toList = draft.find(({ id }) => id === to);
      if (fromList && toList) {
        transferArrayItem(fromList?.tasks, toList?.tasks, prevIndex, currIndex);
      }
    });
    patchState({ lists: updatedLists });
    return this.boardService.moveTask(taskId, to).pipe(
      tap(
        () => {},
        () => {
          patchState({ lists });
          this.toast.error('Failed to move the task');
        },
      ),
    );
  }

  @Action(BoardsAction.MoveTaskWithList)
  moveTaskWithList(
    { patchState, getState }: StateContext<BoardsStateModel>,
    { listId, currIndex, prevIndex }: BoardsAction.MoveTaskWithList,
  ) {
    const lists = getState().lists;
    const updatedLists = produce(lists, (draft) => {
      const list = draft.find(({ id }) => id === listId);
      if (list) {
        moveItemInArray(list.tasks, prevIndex, currIndex);
      }
    });
    patchState({ lists: updatedLists });
  }

  @Action(BoardsAction.Reorder)
  reOrderLists({ patchState, getState }: StateContext<BoardsStateModel>, { id, newList }: BoardsAction.Reorder) {
    const newListsIds = newList.map(({ id }) => id);
    const { lists } = getState();
    let reOrderedList = sortBy(lists, (item) => {
      return newListsIds.indexOf(item.id);
    });
    patchState({ lists: reOrderedList });
    return this.boardService.reOrderList(id, newList).pipe(
      tap(
        () => {},
        () => {
          patchState({ lists });
          this.toast.error('Failed to save order!');
        },
      ),
    );
  }
}
