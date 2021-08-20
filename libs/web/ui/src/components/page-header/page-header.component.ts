import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
export interface Breadcrumb {
  label: string;
  link: string;
}
@Component({
  selector: 'compito-page-header',
  template: `
    <header class="py-2 px-8 bg-gray-100 shadow-inner h-16">
      <nav aria-label="Breadcrumb" class="text-gray-600" *ngIf="breadcrumbs.length > 0">
        <ol class="list-none flex items-center space-x-6 text-sm">
          <ng-container *ngFor="let item of breadcrumbs">
            <li>
              <a [routerLink]="item.link">{{ item.label }}</a>
            </li>
          </ng-container>
        </ol>
      </nav>
      <div>
        <ng-container *ngIf="loading; else titleSection">
          <shimmer height="24px" class="mt-1" width="150px" [rounded]="true"></shimmer>
        </ng-container>
        <ng-template #titleSection>
          <h1 class="text-xl font-bold">{{ title }}</h1>
        </ng-template>
      </div>
    </header>
  `,
  styles: [
    `
      nav {
        li {
          @apply relative;
          &:not(:last-child):after {
            content: '>';
            position: absolute;
            top: 1px;
            right: -1rem;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input() title: string | undefined = '';
  @Input() loading = false;
  @Input() breadcrumbs: Breadcrumb[] = [];
}
