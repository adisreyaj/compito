import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'compito-sidebar',
  template: `
    <p>
      sidebar works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
