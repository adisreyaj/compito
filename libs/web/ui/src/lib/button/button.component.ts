import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

export const BUTTON_SIZE_PADDINGS = {
  sm: 'px-3 py-1',
  lg: 'px-3 py-2',
};

@Component({
  selector: 'button[btn], a[btn]',
  template: ` <p>button works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @HostBinding('class') get classes() {
    return `btn rounded-md
    flex items-center
    btn-${this.variant}
    ${
      this.variant === 'warn'
        ? 'bg-red-600 hover:bg-red-700'
        : 'bg-primary hover:bg-primary-dark'
    }
    ${BUTTON_SIZE_PADDINGS[this.size]}
    ${this.size === 'sm' ? 'text-sm' : 'text-base'}
    text-white
    border
    border-transparent
    hover:shadow-m
    focus:outline-none
    focus:ring-primary focus:ring-1 focus:ring-offset-1
    `;
  }

  @Input() size: 'sm' | 'lg' = 'lg';
  @Input() variant: 'primary' | 'secondary' | 'warn' = 'primary';
  @Input() loading: boolean | null = false;
}
