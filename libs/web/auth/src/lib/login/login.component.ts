import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ToastService } from '@compito/web/ui';

@Component({
  selector: 'compito-login',
  template: `
    <main class="w-screen h-screen grid lg:grid-cols-2">
      <section class="place-items-center bg-primary-gradient hidden lg:grid">
        <div>
          <div class="text-white">
            <h1 class="text-lg font-bold">Welcome to Compito</h1>
            <div class="flex space-x-2 items-center">
              <p>Tasks done right!</p>
              <div class="rounded-full bg-green-500">
                <rmx-icon class="icon-xxs text-white" name="check-line"></rmx-icon>
              </div>
            </div>
            <div class="rounded-md shadow-lg mt-6">
              <img src="assets/images/home.jpg" alt="Board" height="400" width="500" class="rounded-md" />
            </div>
          </div>
        </div>
      </section>
      <section class="grid place-items-center bg-white">
        <div class="max-w-lg lg:w-10/12 w-9/12" cdkTrapFocus cdkTrapFocusAutoCapture>
          <header class="mb-6 flex justify-center">
            <img src="assets/images/logo-full.svg" height="65" width="200" alt="Compito" />
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
      </section>
    </main>
  `,
  styles: [
    `
      main {
        @apply w-screen h-screen;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  constructor(public auth: AuthService, private activatedRoute: ActivatedRoute, private toast: ToastService) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParams?.code === 'INVALID_SESSION') {
      this.toast.error('Invalid session! Please login again');
    }
  }

  login() {
    this.auth.loginWithRedirect({});
  }
}
