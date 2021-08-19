import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';

@Component({
  selector: 'compito-users-create-modal',
  template: ` <compito-modal title="Add New Project" [ref]="ref" cdkTrapFocus cdkTrapFocusAutoCapture>
    <section>
      <form [formGroup]="userForm" id="userForm" class="max-w-xl" (ngSubmit)="handleFormSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input class="w-full" type="email" id="email" formControlName="email" cdkFocusInitial />
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
