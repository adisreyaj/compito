import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CardEvent } from '@compito/api-interfaces';
import { User } from '@prisma/client';

@Component({
  selector: 'compito-user-select',
  template: ` <div class="flex flex-col w-64 p-1" cdkTrapFocus>
    <div class="mb-0 form-group">
      <input type="text" class="w-full" #search />
    </div>
    <ul class="space-y-2 overflow-y-auto max-h-60" role="listbox">
      <ng-container *ngFor="let user of users">
        <li
          role="option"
          class="flex items-center p-2 space-x-2 rounded-md cursor-pointer hover:bg-gray-100"
          (click)="clicked.emit({ type: 'toggle', payload: user })"
          #user
        >
          <div>
            <ng-container *ngIf="!selectedMembers.has(user.id); else userAdded">
              <img
                [src]="user?.image ?? 'https://avatar.tobi.sh/' + user.email"
                [alt]="user.firstName"
                width="40"
                height="40"
                class="rounded-full"
              />
            </ng-container>
            <ng-template #userAdded>
              <div
                class="grid rounded-full bg-primary-translucent text-primary place-items-center"
                [style.height.px]="40"
                [style.width.px]="40"
              >
                <rmx-icon name="check-line"></rmx-icon>
              </div>
            </ng-template>
          </div>
          <div>
            <p>
              {{ user.firstName }}
            </p>
            <p class="text-sm text-gray-600">
              {{ user.email }}
            </p>
          </div>
        </li>
      </ng-container>
    </ul>
    <footer class="flex items-center pt-2 space-x-2">
      <button btn size="sm" (click)="clicked.emit({ type: 'save' })">Save</button>
      <button btn size="sm" variant="secondary" (click)="hide()">Cancel</button>
    </footer>
  </div>`,
})
export class UserSelectComponent implements AfterViewInit {
  @Input() selectedMembers = new Map();
  @Input() users: User[] | null = [];
  @Input() hide!: () => void;

  @Output() clicked = new EventEmitter<CardEvent>();

  @ViewChild('search', { static: true })
  search: ElementRef<HTMLInputElement> | null = null;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.search) {
        this.search.nativeElement.focus();
      }
    }, 100);
  }
}
