import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'compito-landing',
  template: `
    <main class="w-screen h-screen bg-white">
      <header class="p-4 md:px-8 flex items-center justify-between">
        <img src="assets/images/logo-full.svg" alt="Compito Logo" width="120" />
        <nav>
          <ul class="flex space-x-4 items-center text-sm">
            <li>
              <a
                href="https://github.com/adisreyaj/compito"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center rounded-md py-1 px-2 bg-gray-100 space-x-2 hover:text-primary"
              >
                <rmx-icon class="icon-sm" name="github-line"></rmx-icon>
                <p>Github</p>
              </a>
            </li>
            <a
              href="https://twitter.com/AdiSreyaj"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center rounded-md py-1 px-2 bg-gray-100 space-x-2 hover:text-primary"
            >
              <rmx-icon class="icon-sm" name="twitter-line"></rmx-icon>
              <p>Twitter</p>
            </a>
          </ul>
        </nav>
      </header>
      <section class="grid grid-cols-1 md:grid-cols-2 md:gap-8 p-4 md:p-8 items-center">
        <div>
          <div>
            <h1 class="text-xl lg:text-2xl font-medium">Compito - Tasks Done Right</h1>
            <p>Simple No BS project management application with a minimalist UI</p>
            <ul class="mt-4 list-disc pl-6">
              <li>Simple and User friendly</li>
              <li>Support for multiple Orgs</li>
              <li>Role based access control</li>
            </ul>
          </div>
          <div class="flex items-center space-x-4 mt-10 lg:mt-14">
            <button btn variant="primary" routerLink="/auth/signup">Create New Account</button>
            <button btn variant="secondary" routerLink="/auth/login">Login</button>
          </div>
        </div>
        <div>
          <img src="assets/images/board.jpg" alt="Board" height="400" />
        </div>
      </section>
    </main>
  `,
})
export class LandingComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/app']);
      }
    });
  }
}
