import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Board, BoardRequest, MultiDocPayload, Project, ProjectRequest } from '@compito/api-interfaces';
import { API_TOKEN } from '@compito/web/ui';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  api = `${this.baseURL}/projects`;
  boardsApi = `${this.baseURL}/boards`;
  constructor(private http: HttpClient, @Inject(API_TOKEN) private baseURL: string) {}

  create(data: ProjectRequest) {
    return this.http.post<Project>(this.api, data);
  }

  getAll() {
    return this.http.get<MultiDocPayload<Project>>(this.api);
  }

  getSingle(id: string) {
    return this.http.get<Project>(`${this.api}/${id}`);
  }

  createBoard(data: BoardRequest) {
    return this.http.post<Board>(this.boardsApi, data);
  }
}
