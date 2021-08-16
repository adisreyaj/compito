import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'compito-footer',
  template: `
    <p>
      footer works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
