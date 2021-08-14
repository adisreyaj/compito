import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'compito-signup',
  template: `
    <p>
      signup works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
