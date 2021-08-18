import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'compito-loading-card',
  template: `
    <article [style.height]="height" class="p-4 relative rounded-md border border-gray-100 bg-white shadow-sm">
      <ng-content></ng-content>
    </article>
  `,
  styles: [],
})
export class LoadingCardComponent implements OnInit {
  @Input() height = '';
  constructor() {}

  ngOnInit(): void {}
}
