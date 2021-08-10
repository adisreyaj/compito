import { Injectable } from '@angular/core';
import { Board } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { BoardsService } from '../boards.service';
import { BoardsAction } from './boards.actions';
export class BoardsStateModel {
  public board: Board | null = null;
}

const defaults: BoardsStateModel = {
  board: null,
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

  constructor(private boardService: BoardsService) {}
  @Action(BoardsAction.Get)
  add({ patchState }: StateContext<BoardsStateModel>, { payload }: BoardsAction.Get) {
    return this.boardService.get(payload).pipe(
      tap((data) => {
        patchState({ board: data });
      }),
    );
  }
  @Action(BoardsAction.AddTask)
  addTask({ patchState }: StateContext<BoardsStateModel>, { payload }: BoardsAction.AddTask) {
    return this.boardService.addTask(payload).pipe(tap((data) => {}));
  }
}
