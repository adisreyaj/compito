import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { InviteRequest, MultiDocPayload, Role, User } from '@compito/api-interfaces';
import { API_TOKEN } from '@compito/web/ui';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly usersAPI = `${this.baseURL}/users`;
  private readonly rolesAPI = `${this.baseURL}/roles`;
  private readonly invitesAPI = `${this.baseURL}/invites`;
  constructor(private http: HttpClient, @Inject(API_TOKEN) private baseURL: string) {}

  inviteUser(data: InviteRequest) {
    return this.http.post<User>(this.invitesAPI, data);
  }

  getAllRoles() {
    return this.http.get<Role[]>(this.rolesAPI);
  }

  getInvites() {
    return this.http.get<any[]>(this.invitesAPI);
  }

  cancelInvite(id: string) {
    return this.http.post<any>(`${this.invitesAPI}/${id}/cancel`, {});
  }

  getAll() {
    return this.http.get<MultiDocPayload<User>>(this.usersAPI);
  }

  getSingle(id: string) {
    return this.http.get<User>(`${this.usersAPI}/${id}`);
  }
}
