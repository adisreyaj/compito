import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';

@Component({
  selector: 'compito-users-create-modal',
  template: ` <compito-modal title="Add New Project" [ref]="ref" cdkTrapFocus>
    <section>
      <form [formGroup]="userForm" id="userForm" class="max-w-xl" (ngSubmit)="handleFormSubmit()">
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input class="w-full" type="text" id="firstName" formControlName="firstName" autofocus />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input class="w-full" type="text" id="lastName" formControlName="lastName" autofocus />
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input class="w-full" type="email" id="email" formControlName="email" />
        </div>
        <div class="form-group w-1/2">
          <label for="password">Password</label>
          <input class="w-full" type="password" id="password" formControlName="password" />
        </div>
      </form>
    </section>

    <ng-template compitoModalActions>
      <div class="flex justify-end space-x-4">
        <button btn type="button" variant="secondary" (click)="ref.close()">Close</button>
        <button btn type="submit" form="userForm" variant="primary" [disabled]="userForm.invalid">Create</button>
      </div>
    </ng-template>
  </compito-modal>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersCreateModalComponent implements OnInit {
  userForm!: FormGroup;

  constructor(public ref: DialogRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  handleFormSubmit() {
    this.ref.close(this.userForm.value);
  }

  private initForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(3)]],
    });
  }
}
