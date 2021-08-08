import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'compito-boards',
  templateUrl: './boards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
