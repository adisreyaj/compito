import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_TOKEN } from '@compito/web/ui/tokens';

@Injectable({
  providedIn: 'root',
})
export class OrgSelectionService {
  api = `${this.baseURL}`;
  constructor(private http: HttpClient, @Inject(API_TOKEN) private baseURL: string) {}

  getOnboardingDetails(sessionToken: string) {
    return this.http.get(`${this.api}/users/pre-auth/onboard`, {
      headers: {
        'x-session-token': sessionToken,
      },
    });
  }

  accept(id: string, sessionToken: string) {
    return this.http.post(
      `${this.api}/invites/pre-auth/${id}/accept`,
      {},
      {
        headers: {
          'x-session-token': sessionToken,
        },
      },
    );
  }
  reject(id: string, sessionToken: string) {
    return this.http.post(
      `${this.api}/invites/pre-auth/${id}/reject`,
      {},
      {
        headers: {
          'x-session-token': sessionToken,
        },
      },
    );
  }
}
