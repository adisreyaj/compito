import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'compito-org-invite-card',
  template: `
    <article
      class="p-4 relative rounded-md border transition-all duration-200 ease-in
                     border-gray-100 bg-white shadow-sm"
    >
      <header class="">
        <div>
          <div class="flex items-center justify-between">
            <p class="text-md font-medium cursor-pointer hover:text-primary">Sreyaj</p>
          </div>
        </div>
        <div class="text-xs text-gray-400 mt-1">
          <p>
            Invited
            <span class="font-medium text-gray-600">2 days ago</span> by
            <span class="font-medium text-gray-600">John Doe</span>
          </p>
          <p>
            as
            <span class="font-medium text-gray-600">Org Admin</span>
          </p>
        </div>
      </header>
      <footer class="flex justify-end space-x-4 mt-6">
        <button btn size="sm" type="button" variant="secondary" (click)="({})">Reject</button>
        <button btn size="sm" type="submit" form="orgForm" variant="primary">Accept & Login</button>
      </footer>
    </article>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgInviteCardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
