import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';
import { kebabCase } from 'voca';

@Component({
  selector: 'compito-orgs-create-modal',
  template: ` <compito-modal title="Add New Org" [ref]="ref" cdkTrapFocus>
    <section>
      <form [formGroup]="orgForm" id="orgForm" class="max-w-xl" (ngSubmit)="handleFormSubmit()">
        <div class="form-group">
          <label for="name">Name</label>
          <input class="w-full" type="text" id="name" formControlName="name" autofocus />
        </div>
      </form>
    </section>

    <ng-template compitoModalActions>
      <div class="flex justify-end space-x-4">
        <button btn type="button" variant="secondary" (click)="ref.close()">Close</button>
        <button btn type="submit" form="orgForm" variant="primary" [disabled]="orgForm.invalid">Create</button>
      </div>
    </ng-template>
  </compito-modal>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgsCreateModalComponent implements OnInit {
  orgForm!: FormGroup;

  constructor(public ref: DialogRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    const initialData = this.ref.data?.initialData;
    if (initialData) {
      this.orgForm.setValue(initialData);
    }
  }

  handleFormSubmit() {
    this.ref.close(this.orgForm.value);
  }

  private initForm() {
    this.orgForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      slug: ['', Validators.required],
      members: [[]],
    });
    this.orgForm.get('name')?.valueChanges.subscribe((data) => {
      this.orgForm.get('slug')?.setValue(kebabCase(data));
    });
  }
}
