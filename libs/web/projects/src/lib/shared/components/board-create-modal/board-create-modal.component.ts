import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';

@Component({
  selector: 'compito-board-create-modal',
  template: `
    <compito-modal title="Add New Board" [ref]="ref" cdkTrapFocus>
      <section>
        <form [formGroup]="boardForm" id="boardForm" class="max-w-xl" (ngSubmit)="handleFormSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input class="w-full" type="text" id="name" formControlName="name" autofocus />
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
          <button btn type="submit" form="boardForm" variant="primary" [disabled]="boardForm.invalid">Create</button>
        </div>
      </ng-template>
    </compito-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCreateModalComponent implements OnInit {
  boardForm!: FormGroup;

  constructor(public ref: DialogRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.boardForm.get('projectId')?.setValue(this.ref.data.projectId);
  }

  handleFormSubmit() {
    this.ref.close(this.boardForm.value);
  }

  private initForm() {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(3)]],
      lists: [[]],
      projectId: ['', Validators.required],
    });
  }
}
