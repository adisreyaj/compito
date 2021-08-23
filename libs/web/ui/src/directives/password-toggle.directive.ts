/* eslint-disable @angular-eslint/directive-selector */
import { CommonModule } from '@angular/common';
import { Directive, ElementRef, NgModule } from '@angular/core';

const eyeOpen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"/><path fill="#505050" d="M12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9C2.121 6.88 6.608 3 12 3zm0 16a9.005 9.005 0 008.777-7 9.005 9.005 0 00-17.554 0A9.005 9.005 0 0012 19zm0-2.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm0-2a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>`;
const eyeClose = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"/><path fill="#505050" d="M17.882 19.297A10.949 10.949 0 0112 21c-5.392 0-9.878-3.88-10.819-9a10.982 10.982 0 013.34-6.066L1.392 2.808l1.415-1.415 19.799 19.8-1.415 1.414-3.31-3.31zM5.935 7.35A8.965 8.965 0 003.223 12a9.005 9.005 0 0013.201 5.838l-2.028-2.028A4.5 4.5 0 018.19 9.604L5.935 7.35zm6.979 6.978l-3.242-3.242a2.5 2.5 0 003.241 3.241zm7.893 2.264l-1.431-1.43A8.935 8.935 0 0020.777 12 9.005 9.005 0 009.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.947 10.947 0 01-2.012 4.592zm-9.084-9.084a4.5 4.5 0 014.769 4.769l-4.77-4.769z"/></svg>`;

@Directive({
  selector: '[passwordToggle]',
})
export class PasswordToggleDirective {
  private isVisible = false;
  constructor(private el: ElementRef) {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('span');
    span.innerHTML = eyeOpen;
    span.classList.add('password-toggle');
    span.addEventListener('click', () => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }
  toggle(span: HTMLElement) {
    if (this.isVisible) {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = eyeOpen;
      this.isVisible = false;
    } else {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = eyeClose;
      this.isVisible = true;
    }
  }
}

@NgModule({
  declarations: [PasswordToggleDirective],
  imports: [CommonModule],
  exports: [PasswordToggleDirective],
})
export class PasswordToggleDirectiveModule {}
