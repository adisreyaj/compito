import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { UserAvatarGroupData } from '../user-avatar-group';

@Component({
  selector: 'compito-task-card',
  template: `
    <div class="bg-white rounded-md px-4 py-2 shadow-sm border hover:shadow-md">
      <header>
        <p class="font-medium">Login UI</p>
      </header>
      <div>
        <p class="text-sm text-gray-500 line-clamp-2">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.sit amet
          consectetur adipisicing elit.
        </p>
      </div>
      <footer class="flex items-center justify-between mt-4 text-gray-500">
        <div>
          <compito-user-avatar-group
            [data]="assignees"
            [size]="25"
          ></compito-user-avatar-group>
        </div>
        <div class="footer__meta flex items-center space-x-4 text-sm">
          <div class="flex items-center space-x-1">
            <rmx-icon name="message-3-line"></rmx-icon>
            <p>4</p>
          </div>
          <div class="flex items-center space-x-1">
            <rmx-icon name="attachment-2"></rmx-icon>
            <p>4</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .footer {
        &__meta {
          rmx-icon {
            width: 18px;
            height: 18px;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent implements OnInit {
  @Input() task = null;
  @Input() assignees: UserAvatarGroupData[] = [
    {
      name: 'John Doe',
      image: 'https://avatar.tobi.sh/john',
    },
    {
      name: 'Jane Doe',
      image: 'https://avatar.tobi.sh/jane',
    },
    {
      name: 'Maicy Williams',
      image: 'https://avatar.tobi.sh/maicy',
    },
    {
      name: 'Patrick Jane',
      image: 'https://avatar.tobi.sh/patrick',
    },
    {
      name: 'Robert Jr',
      image: 'https://avatar.tobi.sh/robert',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
