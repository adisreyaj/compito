import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { Invite } from '@compito/api-interfaces';
import { TimeAgoModule } from '../../pipes';
import { ButtonModule } from '../button';

@Component({
  selector: 'compito-org-invite-card',
  template: `
    <article
      *ngIf="data"
      class="p-4 relative rounded-md border transition-all duration-200 ease-in
                     border-gray-100 bg-white shadow-sm"
    >
      <header class="">
        <div>
          <div class="flex items-center justify-between">
            <p class="text-md font-medium cursor-pointer hover:text-primary">{{ data?.org?.name }}</p>
          </div>
        </div>
        <div class="text-xs text-gray-400 mt-1">
          <p>
            Invited
            <span class="font-medium text-gray-600">{{ data?.createdAt | timeAgo }}</span> by
            <span class="font-medium text-gray-600">{{ data?.invitedBy?.firstName }}</span>
          </p>
          <p>
            as
            <span class="font-medium text-gray-600">{{ data?.role?.label }}</span>
          </p>
        </div>
      </header>
      <footer class="flex justify-end space-x-4 mt-6">
        <button btn size="sm" type="button" variant="secondary" (click)="clicked.emit('reject')">Reject</button>
        <button btn size="sm" type="submit" form="orgForm" variant="primary" (click)="clicked.emit('accept')">
          {{ displayCondition === 'pre-auth' ? 'Accept & Login' : 'Accept' }}
        </button>
      </footer>
    </article>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgInviteCardComponent {
  @Input() data: Invite | null = null;
  @Input() displayCondition: 'pre-auth' | 'post-auth' = 'post-auth';
  @Output() clicked = new EventEmitter<'accept' | 'reject'>();
}

@NgModule({
  declarations: [OrgInviteCardComponent],
  exports: [OrgInviteCardComponent],
  imports: [CommonModule, ButtonModule, TimeAgoModule],
})
export class OrgInviteCardModule {}
