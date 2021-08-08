import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'compito-projects',
  template: ` <p>projects works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
