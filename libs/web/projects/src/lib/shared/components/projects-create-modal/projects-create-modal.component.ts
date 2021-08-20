import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';
import { kebabCase } from 'voca';
@Component({
  selector: 'compito-projects-create-modal',
  template: `
    <compito-modal title="Add New Project" [ref]="ref" cdkTrapFocus cdkTrapFocusAutoCapture>
      <section>
        <form [formGroup]="projectForm" id="projectForm" class="max-w-xl" (ngSubmit)="handleFormSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input class="w-full" type="text" id="name" formControlName="name" cdkFocusInitial />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea class="w-full" type="text" id="description" formControlName="description"></textarea>
          </div>
        </form>
      </section>

      <ng-template compitoModalActions>
        <div class="flex justify-end space-x-4">
          <button btn type="button" variant="secondary" (click)="ref.close()">Close</button>
          <button btn type="submit" form="projectForm" variant="primary" [disabled]="projectForm.invalid">
            {{ ref.data.isUpdateMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </ng-template>
    </compito-modal>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsCreateModalComponent implements OnInit {
  projectForm!: FormGroup;

  constructor(public ref: DialogRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    const initialData = this.ref.data?.initialData;
    if (initialData) {
      this.projectForm.patchValue(initialData);
    }
  }

  handleFormSubmit() {
    this.ref.close(this.projectForm.value);
  }

  private initForm() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(3)]],
      slug: ['', Validators.required],
      members: [[]],
    });
    this.projectForm.get('name')?.valueChanges.subscribe((data) => {
      this.projectForm.get('slug')?.setValue(kebabCase(data));
    });
  }
}
