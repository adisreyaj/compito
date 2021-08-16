import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'compito-user-card',
  template: `
    <p>
      user-card works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
