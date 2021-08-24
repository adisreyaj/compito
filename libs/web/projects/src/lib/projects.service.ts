import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  Board,
  BoardRequest,
  MultiDocPayload,
  Project,
  ProjectRequest,
  UpdateMembersRequest,
} from '@compito/api-interfaces';
import { API_TOKEN } from '@compito/web/ui/tokens';
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

  update(id: string, data: ProjectRequest) {
    return this.http.patch<Project>(`${this.api}/${id}`, data);
  }
  delete(id: string) {
    return this.http.delete<Project>(`${this.api}/${id}`);
  }

  getAll() {
    return this.http.get<MultiDocPayload<Project>>(this.api);
  }

  getSingle(id: string) {
    return this.http.get<Project>(`${this.api}/${id}`);
  }
  updateMembers(id: string, data: UpdateMembersRequest) {
    return this.http.patch<Project>(`${this.api}/${id}/members`, data);
  }

  createBoard(data: BoardRequest) {
    return this.http.post<Board>(this.boardsApi, data);
  }
  updateBoard(id: string, data: Partial<BoardRequest>) {
    return this.http.patch<Board>(`${this.boardsApi}/${id}`, data);
  }
}
