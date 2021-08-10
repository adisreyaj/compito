import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Board, Task, TaskRequest } from '@compito/api-interfaces';
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
}
