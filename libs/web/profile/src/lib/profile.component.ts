import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { UserDetails } from '@compito/api-interfaces';
import { formatUser, ToastService } from '@compito/web/ui';
import { UsersAction } from '@compito/web/users/state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'compito-profile',
  template: `
    <compito-page-header title="Profile"></compito-page-header>
    <section class="mt-4 px-4 md:px-8">
      <form class="py-6 bg-white rounded-md max-w-xl" id="userForm" [formGroup]="userForm" (ngSubmit)="updateUser()">
        <div class="mb-4">
          <img
            [src]="'https://avatar.tobi.sh/' + userForm.get('email')?.value"
            [alt]="userForm.get('firstName')?.value"
            class="rounded-full"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input class="w-full" type="text" id="firstName" formControlName="firstName" />
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 group-validation" formGroupName="passwords">
          <div class="form-group max-w-xs">
            <label for="currentPassword">Current Password</label>
            <input
              class="w-full"
              type="password"
              [style.paddingRight.rem]="2"
              id="currentPassword"
              formControlName="current"
              passwordToggle
            />
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              [style.paddingRight.rem]="2"
              class="w-full"
              type="password"
              id="newPassword"
              formControlName="new"
              passwordToggle
            />
          </div>
        </div>
        <div class="form-group w-full md:w-1/3">
          <label for="role">Role</label>
          <input class="w-full" type="text" id="role" formControlName="roleName" />
        </div>
        <footer class="flex justify-end space-x-4 mt-4">
          <button btn type="button" variant="secondary" routerLink="/">Cancel</button>
          <button
            btn
            type="submit"
            form="userForm"
            variant="primary"
            [disabled]="userForm.pristine || userForm.invalid"
          >
            Update
          </button>
        </footer>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  userForm!: FormGroup;
  userId: string | null = null;
  user$ = this.auth.user$.pipe(formatUser());
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.user$.subscribe((user: UserDetails | null) => {
      if (user) {
        this.userId = user.userId;
        this.userForm.patchValue({
          firstName: user.given_name,
          lastName: user.family_name,
          email: user.email,
          roleName: user.role.label,
        });
        this.cdr.markForCheck();
      }
    });
  }

  updateUser() {
    if (this.userForm.valid && this.userId) {
      const { passwords, firstName, lastName } = this.userForm.value;
      const data = {
        firstName,
        lastName,
        password: passwords.current || null,
        newPassword: passwords.new || null,
      };
      this.store.dispatch(new UsersAction.UpdateUser(this.userId, data)).subscribe(
        () => {
          this.toast.success('Updated info successfully!');
        },
        () => {
          this.toast.error('Failed to update user info');
        },
      );
    }
  }

  private initForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      email: [
        { disabled: true, value: '' },
        [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(200)],
      ],
      passwords: this.fb.group(
        {
          current: [''],
          new: [''],
        },
        {
          validators: this.checkPasswords,
          updateOn: 'change',
        },
      ),
      roleName: [{ disabled: true, value: '' }],
    });
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const passwordValidators = [Validators.required, Validators.minLength(6), Validators.maxLength(32)];
    const pass = group.get('current');
    const newPass = group.get('new');
    console.log(pass?.value, newPass?.value);
    if (pass?.value !== '' || newPass?.value !== '') {
      pass?.setValidators([Validators.required]);
      newPass?.setValidators(passwordValidators);
      pass?.updateValueAndValidity({
        emitEvent: false,
        onlySelf: true,
      });
      newPass?.updateValueAndValidity({
        emitEvent: false,
        onlySelf: true,
      });
    } else {
      pass?.clearValidators();
      newPass?.clearValidators();
      pass?.updateValueAndValidity({
        emitEvent: false,
        onlySelf: true,
      });
      newPass?.updateValueAndValidity({
        emitEvent: false,
        onlySelf: true,
      });
    }
    if (pass?.value !== '' && newPass?.value !== '') {
      return pass?.value === newPass?.value ? { same: true } : null;
    }
    return null;
  };
}
