import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'compito-users',
  template: `
    <p>
      users works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
