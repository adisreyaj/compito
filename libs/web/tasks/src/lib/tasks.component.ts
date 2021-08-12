import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Breadcrumb } from '@compito/web/ui';

@Component({
  selector: 'compito-tasks',
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [{ label: 'Home', link: '/' }];
  constructor() {}

  ngOnInit(): void {}
}
