import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

export interface UserAvatarGroupData {
  name: string;
  image: string;
}

@Component({
  selector: 'compito-user-avatar-group',
  template: `
    <div>
      <ul class="flex items-center -space-x-4">
        <ng-container *ngFor="let item of data | slice: 0:itemsToShow">
          <li
            [tippy]="item.name"
            class="rounded-full bg-white p-1 cursor-pointer"
          >
            <img
              class="rounded-full"
              [width]="size"
              [height]="size"
              [src]="item.image"
              [alt]="item.name"
            />
          </li>
        </ng-container>
        <ng-container *ngIf="data.length - itemsToShow > 0">
          <li class="rounded-full bg-gray-100 cursor-pointer">
            <div
              class="w-10 h-10 flex justify-center items-center text-gray-500"
            >
              <p class="text-sm">+{{ data.length - itemsToShow }}</p>
            </div>
          </li>
        </ng-container>
      </ul>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarGroupComponent implements OnInit {
  @Input() data: UserAvatarGroupData[] = [];
  @Input() size = 40;
  @Input() itemsToShow = 5;
  constructor() {}

  ngOnInit(): void {}
}
