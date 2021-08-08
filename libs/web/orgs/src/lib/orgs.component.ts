import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'compito-orgs',
  templateUrl: './orgs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
