import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'compito-page-header',
  template: `
    <header class="py-4 px-8 bg-gray-100 shadow-inner">
      <div>
        <h1 class="text-2xl font-bold">{{ title }}</h1>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent implements OnInit {
  @Input() title: string | undefined = '';
  constructor() {}

  ngOnInit(): void {}
}
