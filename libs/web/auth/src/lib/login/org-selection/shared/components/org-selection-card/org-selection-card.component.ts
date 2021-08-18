import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'compito-org-selection-card',
  template: `
    <article
      (click)="clicked.emit(data.id)"
      tabindex="0"
      class="p-4 relative rounded-md border cursor-pointer transition-all hover:shadow-lg duration-200 ease-in
                     border-gray-100 bg-white shadow-sm ring-primary hover:ring-2 focus:ring-2 outline-none"
    >
      <header class="flex datas-center justify-between">
        <div>
          <div class="flex datas-center justify-between">
            <p class="text-md font-medium cursor-pointer hover:text-primary">{{ data?.name }}</p>
          </div>
          <p class=" text-xs text-gray-400 ">
            Owner
            <span class="font-medium text-gray-600">{{
              data?.createdBy?.email === userEmail ? 'You' : data?.createdBy?.firstName
            }}</span>
          </p>
        </div>
      </header>
      <div class="my-4">
        <!-- <compito-user-avatar-group [data]="[]"></compito-user-avatar-group> -->
      </div>
      <footer class="flex datas-center justify-between text-xs text-gray-400 mt-4">
        <p>
          Last Updated
          <span class="font-medium text-gray-600">{{ data?.updatedAt | timeAgo }}</span>
        </p>
      </footer>
    </article>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgSelectionCardComponent implements OnInit {
  @Input() data: any;
  @Input() userEmail: any;

  @Output() clicked = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}
}
