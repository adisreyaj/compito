import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'compito-page-header',
  template: `
    <header class="py-4 px-8 border-b">
      <div>
        <h1 class="text-2xl font-bold">{{ title }}</h1>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent implements OnInit {
  @Input() title = '';
  constructor() {}

  ngOnInit(): void {}
}
