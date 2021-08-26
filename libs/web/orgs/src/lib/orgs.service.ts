import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MultiDocPayload, Organization, OrganizationRequest, UpdateMembersRequest } from '@compito/api-interfaces';
import { API_TOKEN } from '@compito/web/ui/tokens';
@Injectable({
  providedIn: 'root',
})
export class OrgService {
  api = `${this.baseURL}/orgs`;
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

  getSingle(id: string) {
    return this.http.get<Organization>(`${this.api}/${id}`);
  }

  updateMembers(id: string, data: UpdateMembersRequest) {
    return this.http.patch<Organization>(`${this.api}/${id}/members`, data);
  }
}
