import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MultiDocPayload, Role, User, UserRequest } from '@compito/api-interfaces';
import { API_TOKEN } from '@compito/web/ui';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  usersAPI = `${this.baseURL}/users`;
  rolesAPI = `${this.baseURL}/roles`;
  constructor(private http: HttpClient, @Inject(API_TOKEN) private baseURL: string) {}

  create(data: UserRequest) {
    return this.http.post<User>(this.usersAPI, data);
  }

  getAllRoles() {
    return this.http.get<Role[]>(this.rolesAPI);
  }
  getAll() {
    return this.http.get<MultiDocPayload<User>>(this.usersAPI);
  }

  getSingle(id: string) {
    return this.http.get<User>(`${this.usersAPI}/${id}`);
  }
}
