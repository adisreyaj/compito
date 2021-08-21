import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';

@Component({
  selector: 'compito-user-role-update-modal',
  template: `<compito-modal title="Update User" [ref]="ref" cdkTrapFocus cdkTrapFocusAutoCapture>
    <section>
      <form [formGroup]="roleForm" id="roleForm" class="max-w-xl" (ngSubmit)="handleFormSubmit()">
        <div class="form-group">
          <label for="priority">Role</label>
          <select name="priority" id="priority" formControlName="role">
            <ng-container *ngFor="let role of roles$ | async">
              <option [value]="role.id">{{ role?.label }}</option>
            </ng-container>
          </select>
        </div>
        <div class="flex items-center space-x-2 text-gray-600 text-sm">
          <rmx-icon name="information-line" class="icon-sm"></rmx-icon>
          <p>Role will be assigned on user's next login!</p>
        </div>
      </form>
    </section>

    <ng-template compitoModalActions>
      <div class="flex justify-end space-x-4">
        <button btn type="button" variant="secondary" (click)="ref.close()">Close</button>
        <button btn type="submit" form="roleForm" variant="primary" [disabled]="roleForm.invalid">Update</button>
      </div>
    </ng-template>
  </compito-modal>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRoleUpdateModalComponent implements OnInit {
  roleForm!: FormGroup;

  constructor(public ref: DialogRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    const initialData = this.ref.data?.initialData;
    if (initialData) {
      this.roleForm.setValue(initialData);
    }
  }

  handleFormSubmit() {
    this.ref.close(this.roleForm.value);
  }

  private initForm() {
    this.roleForm = this.fb.group({
      role: ['', [Validators.required]],
    });
  }

  get roles$() {
    return this.ref.data.roles$;
  }
}
