import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardEvent } from '@compito/api-interfaces';
import { UserAvatarGroupData, userMapToArray } from '@compito/web/ui';
import { DialogRef } from '@ngneat/dialog';
import { User } from '@prisma/client';
import cuid from 'cuid';
import produce from 'immer';
import { BehaviorSubject } from 'rxjs';
import { kebabCase } from 'voca';
@Component({
  selector: 'compito-projects-create-modal',
  template: `
    <compito-modal
      [title]="ref.data?.isUpdateMode ? 'Update Project' : 'Create New Project'"
      [ref]="ref"
      cdkTrapFocus
      cdkTrapFocusAutoCapture
    >
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
          <div class="form-group">
            <label for="description">Members</label>
            <div class="flex items-center">
              <compito-user-avatar-group [data]="selectedMembers$ | async"></compito-user-avatar-group>
              <div [style.height.px]="48" [style.width.px]="48" class="p-1">
                <button
                  type="button"
                  class="btn btn--primary rounded-full outline-none w-full h-full bg-primary-gradient cursor-pointer flex justify-center items-center text-white"
                  [style.marginLeft.rem]="0.3"
                  [tippy]="addAssignees"
                  [zIndex]="9999"
                  placement="bottom-start"
                  variation="menu"
                >
                  <rmx-icon name="add-line"></rmx-icon>
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      <ng-template compitoModalActions>
        <div class="flex justify-end space-x-4">
          <button btn type="button" variant="secondary" (click)="ref.close()">Close</button>
          <button btn type="submit" form="projectForm" variant="primary" [disabled]="projectForm.invalid">
            {{ ref.data?.isUpdateMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </ng-template>
    </compito-modal>

    <ng-template #addAssignees let-hide>
      <compito-user-select
        [hide]="hide"
        [users]="ref.data.users$ | async"
        [selectedMembers]="selectedMembers"
        (clicked)="handleUserSelectEvent($event, hide)"
      ></compito-user-select>
    </ng-template>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsCreateModalComponent implements OnInit {
  projectForm!: FormGroup;
  selectedMembers = new Map<string, User>();
  selectedMembersSubject = new BehaviorSubject<UserAvatarGroupData[]>([]);
  selectedMembers$ = this.selectedMembersSubject.asObservable();

  constructor(public ref: DialogRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    const initialData = this.ref.data?.initialData;
    if (initialData) {
      this.projectForm.patchValue(initialData);
      if (initialData.members) {
        this.ref.data.users$.subscribe((users: User[]) => {
          initialData.members.forEach((userId: string) => {
            const userData = users.find(({ id }) => id === userId);
            if (userData) {
              this.selectedMembers.set(userId, userData);
              this.selectedMembersSubject.next(userMapToArray(this.selectedMembers));
            }
          });
        });
      }
    }
  }

  handleFormSubmit() {
    this.ref.close(this.projectForm.value);
  }

  handleUserSelectEvent({ type, payload }: CardEvent, hide: () => void) {
    switch (type) {
      case 'toggle': {
        if (this.selectedMembers.has(payload.id)) {
          this.selectedMembers = produce(this.selectedMembers, (draft) => {
            draft.delete(payload.id);
          });
        } else {
          this.selectedMembers = produce(this.selectedMembers, (draft) => {
            draft.set(payload.id, payload);
          });
        }
        break;
      }
      case 'save': {
        const members = [...this.selectedMembers.values()];
        this.selectedMembersSubject.next(userMapToArray(this.selectedMembers));
        this.projectForm.patchValue({
          members: members.map(({ id }) => id),
        });
        hide();
        break;
      }
    }
  }

  private initForm() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(3)]],
      slug: ['', Validators.required],
      members: [[]],
    });
    this.projectForm.get('name')?.valueChanges.subscribe((data) => {
      this.projectForm.get('slug')?.setValue(`${kebabCase(data)}-${cuid()}`);
    });
  }
}
