import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'compito-task-card',
  template: `
    <div class="bg-white rounded-md p-4 shadow-sm border hover:shadow-md">
      <header>
        <p class="font-medium">Login UI</p>
      </header>
      <div>
        <p class="text-sm text-gray-500 line-clamp-2">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.sit amet
          consectetur adipisicing elit.
        </p>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent implements OnInit {
  @Input() task = null;
  constructor() {}

  ngOnInit(): void {}
}
