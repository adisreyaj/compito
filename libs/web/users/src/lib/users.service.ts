import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MultiDocPayload, User, UserRequest } from '@compito/api-interfaces';
import { API_TOKEN } from '@compito/web/ui';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  api = `${this.baseURL}/users`;
  constructor(private http: HttpClient, @Inject(API_TOKEN) private baseURL: string) {}

  create(data: UserRequest) {
    return this.http.post<User>(this.api, data);
  }

  getAll() {
    return this.http.get<MultiDocPayload<User>>(this.api);
  }

  getSingle(id: string) {
    return this.http.get<User>(`${this.api}/${id}`);
  }
}
