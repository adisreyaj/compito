import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'compito-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {}

  call() {
    this.http.get('http://localhost:3333/api/organizations').subscribe();
  }
}
