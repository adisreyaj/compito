import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'compito-login',
  template: ` <main class="w-screen h-screen grid bg-gray-100 place-items-center">
    <div class="max-w-md lg:w-10/12 w-9/12">
      <header class="mb-6">
        <img class="mx-auto mb-6" src="assets/images/logo-full.svg" height="65" width="200" alt="Compito" />
        <h1 class="text-lg text-center">Welcome to Compito</h1>
        <div class="flex space-x-2 items-center justify-center">
          <p class="text-gray-600">Tasks done right!</p>
          <div class="rounded-full bg-green-500">
            <rmx-icon class="icon-xxs text-white" name="check-line"></rmx-icon>
          </div>
        </div>
      </header>
      <div class="p-6 bg-white rounded-md flex justify-center">
        <button btn (click)="login()">Login to Compito</button>
      </div>
      <div class="mt-8">
        <p class="text-center text-gray-500">
          Don't have an account yet? <a routerLink="/auth/signup" class="text-primary font-medium">Signup</a>
        </p>
      </div>
    </div>
  </main>`,
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
    this.auth.loginWithRedirect({});
  }
}
