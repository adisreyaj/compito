import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  Invite,
  MultiDocPayload,
  Organization,
  OrganizationRequest,
  UpdateMembersRequest,
} from '@compito/api-interfaces';
import { API_TOKEN } from '@compito/web/ui/tokens';
@Injectable({
  providedIn: 'root',
})
export class OrgService {
  api = `${this.baseURL}/orgs`;
  usersApi = `${this.baseURL}/users`;
  invitesApi = `${this.baseURL}/invites`;
  constructor(private http: HttpClient, @Inject(API_TOKEN) private baseURL: string) {}

  create(data: OrganizationRequest) {
    return this.http.post<Organization>(this.api, data);
  }

  update(id: string, data: OrganizationRequest) {
    return this.http.patch<Organization>(`${this.api}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<Organization>(`${this.api}/${id}`);
  }

  getAll() {
    return this.http.get<MultiDocPayload<Organization>>(this.api);
  }
  getAllInvites() {
    return this.http.get<Invite[]>(`${this.usersApi}/invites`);
  }

  getSingle(id: string) {
    return this.http.get<Organization>(`${this.api}/${id}`);
  }

  updateMembers(id: string, data: UpdateMembersRequest) {
    return this.http.patch<Organization>(`${this.api}/${id}/members`, data);
  }

  acceptInvite(id: string) {
    return this.http.post<void>(`${this.invitesApi}/${id}/accept`, {});
  }
  rejectInvite(id: string) {
    return this.http.post<void>(`${this.invitesApi}/${id}/reject`, {});
  }
}
