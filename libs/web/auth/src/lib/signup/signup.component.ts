import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserSignupRequest } from '@compito/api-interfaces';
import { ToastService } from '@compito/web/ui';
import { API_TOKEN } from '@compito/web/ui/tokens';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'compito-signup',
  template: `
    <main class="w-screen h-screen grid grid-cols-1 lg:grid-cols-2">
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
              <img src="assets/images/board.jpg" alt="Board" height="400" width="500" class="rounded-md" />
            </div>
          </div>
        </div>
      </section>
      <section class="grid place-items-center bg-white">
        <div class="max-w-lg lg:w-10/12 w-9/12" cdkTrapFocus cdkTrapFocusAutoCapture>
          <header class="mb-6 flex justify-center">
            <img src="assets/images/logo-full.svg" height="65" width="200" alt="Compito" />
          </header>
          <form class="p-6 bg-white rounded-md" id="signupForm" [formGroup]="signupForm" (ngSubmit)="signup()">
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input class="w-full" type="text" id="firstName" formControlName="firstName" cdkFocusInitial />
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input class="w-full" type="text" id="lastName" formControlName="lastName" />
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input class="w-full" type="email" id="email" formControlName="email" />
            </div>
            <div class="form-group max-w-xs">
              <label for="password">Password</label>
              <input class="w-full" type="password" id="password" formControlName="password" passwordToggle />
            </div>
            <div class="form-group max-w-xs">
              <label for="org">Org Name</label>
              <input class="w-full" type="text" id="org" formControlName="org" />
            </div>
            <footer class="flex justify-end space-x-4 mt-4">
              <button btn type="button" variant="secondary" routerLink="/auth/login">Cancel</button>
              <button
                btn
                type="submit"
                form="signupForm"
                variant="primary"
                [disabled]="signupForm.invalid || (loading$ | async)"
              >
                Create Account
              </button>
            </footer>
          </form>
          <div class="mt-8">
            <p class="text-center text-gray-500">
              Already have an account? <a routerLink="/auth/login" class="text-primary font-medium">Login</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading$ = new BehaviorSubject(false);
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toast: ToastService,
    @Inject(API_TOKEN) private apiToken: string,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(200)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      org: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]],
    });
  }

  signup() {
    if (this.signupForm.valid) {
      const data: UserSignupRequest = { ...this.signupForm.value };
      this.loading$.next(true);
      this.http.post(`${this.apiToken}/users/signup`, data).subscribe(
        () => {
          this.toast.success('Signed up successfully! You can now login.');
          this.router.navigate(['/auth/login']);
        },
        () => {
          this.loading$.next(false);
        },
      );
    }
  }
}
