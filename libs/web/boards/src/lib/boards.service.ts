import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Board, BoardList, BoardRequest, Task, TaskRequest } from '@compito/api-interfaces';
import { API_TOKEN } from '@compito/web/ui';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  api = `${this.baseURL}/boards`;
  tasksApi = `${this.baseURL}/tasks`;
  constructor(private http: HttpClient, @Inject(API_TOKEN) private baseURL: string) {}

  get(id: string) {
    return this.http.get<Board>(`${this.api}/${id}`);
  }

  addTask(task: TaskRequest) {
    return this.http.post<Task>(`${this.tasksApi}`, task);
  }

  moveTask(taskId: string, newListId: string) {
    const data: Partial<TaskRequest> = {
      list: newListId,
    };
    return this.http.patch<Task>(`${this.tasksApi}/${taskId}`, data);
  }

  reOrderList(boardId: string, newOrderedList: BoardList[]) {
    const data: Partial<BoardRequest> = {
      lists: newOrderedList,
    };
    return this.http.patch<Task>(`${this.api}/${boardId}`, data);
  }
}
