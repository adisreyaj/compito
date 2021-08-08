import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'compito-tasks',
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
