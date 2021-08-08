import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { UserAvatarGroupData } from '@compito/web/ui';

@Component({
  selector: 'compito-project-card',
  template: `
    <article
      class="p-4 rounded-md border transition-all hover:shadow-lg duration-200 ease-in
      border-gray-100 bg-white shadow-sm hover:border-gray-200"
    >
      <header class="flex items-center justify-between">
        <p class="text-lg font-medium cursor-pointer">Compito Web</p>
        <button class="text-gray-500">
          <rmx-icon name="more-2-fill"></rmx-icon>
        </button>
      </header>
      <div class="my-4">
        <compito-user-avatar-group [data]="data"></compito-user-avatar-group>
      </div>
      <footer
        class="flex items-center justify-between text-xs text-gray-400 mt-4"
      >
        <div>
          <p>
            Updated
            <span class="text-sm font-medium text-gray-600">10mins</span> ago
          </p>
        </div>
        <div>
          <p><span class="text-sm font-medium text-gray-600">19</span> Tasks</p>
        </div>
      </footer>
    </article>
  `,
  styles: [
    `
      header rmx-icon {
        width: 20px;
        height: 20px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent implements OnInit {
  @Input() data: UserAvatarGroupData[] = [
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
