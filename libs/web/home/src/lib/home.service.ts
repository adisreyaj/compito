import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Board, MultiDocPayload, Project, Task } from '@compito/api-interfaces';
import { API_TOKEN } from '@compito/web/ui';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly projects = `${this.baseURL}/projects`;
  private readonly boards = `${this.baseURL}/boards`;
  private readonly tasks = `${this.baseURL}/tasks`;
  constructor(private http: HttpClient, @Inject(API_TOKEN) private baseURL: string) {}

  getRecentTasks() {
    return this.http.get<MultiDocPayload<Task>>(`${this.tasks}?limit=5&sort=updatedAt&order=desc`);
  }

  getHighPriorityTasks() {
    return this.http.get<MultiDocPayload<Task>>(
      `${this.tasks}?limit=5&priority=High,Highest&sort=updatedAt&order=desc`,
    );
  }

  getProjects() {
    return this.http.get<MultiDocPayload<Project>>(`${this.projects}?limit=5&sort=updatedAt&order=desc`);
  }

  getBoards() {
    return this.http.get<MultiDocPayload<Board>>(`${this.boards}?limit=5&sort=updatedAt&order=desc`);
  }
}
