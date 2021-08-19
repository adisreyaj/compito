import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'compito-tasks-create-modal',
  template: `
    <compito-modal title="Add New Task" [ref]="ref" cdkTrapFocus cdkTrapFocusAutoCapture>
      <section>
        <form [formGroup]="taskForm" id="taskForm" class="max-w-xl" (ngSubmit)="handleFormSubmit()">
          <div class="form-group">
            <label for="title">Title</label>
            <input class="w-full" type="text" id="title" formControlName="title" cdkFocusInitial />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea class="w-full" type="text" id="description" formControlName="description" rows="5"></textarea>
          </div>
          <div class="form-group">
            <label for="priority">Priority</label>
            <select name="priority" id="priority" formControlName="priority">
              <ng-container *ngFor="let priority of priorities | async">
                <option [value]="priority">{{ priority }}</option>
              </ng-container>
            </select>
          </div>
        </form>
      </section>
      <ng-template compitoModalActions>
        <div class="flex justify-end space-x-4">
          <button btn variant="secondary" (click)="ref.close()">Close</button>
          <button btn variant="primary" form="taskForm" type="submit">Create</button>
        </div>
      </ng-template>
    </compito-modal>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksCreateModalComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(public ref: DialogRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  handleFormSubmit() {
    this.ref.close(this.taskForm.value);
  }

  private initForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      priority: ['Medium', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(3)]],
      list: ['', Validators.required],
      assignees: [[]],
      tags: [[]],
    });
  }
  get priorities() {
    return this.ref.data.priorities$ as Observable<string[]>;
  }
}
