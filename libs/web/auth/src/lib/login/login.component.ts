import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'compito-login',
  templateUrl: './login.component.html',
  styles: [
    `
      main {
        @apply w-screen h-screen;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  login() {
    this.auth.loginWithRedirect();
  }
}
