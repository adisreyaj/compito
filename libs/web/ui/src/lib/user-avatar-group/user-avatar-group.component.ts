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
        <ng-container *ngFor="let item of data">
          <li
            [tippy]="item.name"
            class="rounded-full bg-white p-1 cursor-pointer"
          >
            <img
              class="rounded-full"
              width="40"
              height="40"
              [src]="item.image"
              [alt]="item.name"
            />
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
  constructor() {}

  ngOnInit(): void {}
}
