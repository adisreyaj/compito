import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'compito-section-header',
  template: `
    <div class="py-2 bg-white flex items-center justify-between mb-2">
      <div>
        <h1 class="text-xl pl-4 font-medium text-gray-500 relative">{{ title }}</h1>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      h1 {
        &:before {
          content: '';
          position: absolute;
          width: 8px;
          height: 100%;
          background: var(--primary-gradient);
          left: 0px;
          @apply rounded-md;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
  @Input() title = '';
}
