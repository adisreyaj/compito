import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'compito-section-header',
  template: `
    <div class="py-2 bg-white flex items-center justify-between">
      <div>
        <h1 class="text-xl font-medium text-gray-600">{{ title }}</h1>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent implements OnInit {
  @Input() title = '';
  constructor() {}

  ngOnInit(): void {}
}
