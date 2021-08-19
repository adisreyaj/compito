import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DataLoading, DataLoadingState } from '@compito/api-interfaces';
import { ToastService } from '@compito/web/ui';
import { BehaviorSubject } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { environment } from '../../../../../../../apps/compito/src/environments/environment';
import { OrgSelectionService } from './org-selection.service';

@Component({
  selector: 'compito-org-selection',
  templateUrl: './org-selection.component.html',
  styles: [
    `
      header.main {
        @apply flex justify-between items-center px-4 px-4 lg:px-8 bg-white xl:px-20;
        height: 80px;
      }
      main.org-selection {
        height: 100vh;
        grid-template-columns: 3fr 5fr;
      }
      .orgs {
        &__list {
          @apply pt-8;
          @apply grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4;
        }
      }
      .invites {
        &__list {
          @apply pt-8;
          @apply grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgSelectionComponent implements OnInit {
  orgSubject = new BehaviorSubject<any[]>([]);
  orgs$ = this.orgSubject.asObservable();
  inviteSubject = new BehaviorSubject<any[]>([]);
  invites$ = this.inviteSubject.asObservable();

  loadingDetailsState = new BehaviorSubject<DataLoading>({ type: DataLoadingState.loading });
  loadingDetailsState$ = this.loadingDetailsState.asObservable();

  userEmail$ = this.auth.user$.pipe(pluck('email'));
  constructor(
    private orgService: OrgSelectionService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.sessionToken) {
      this.loadingDetailsState.next({ type: DataLoadingState.loading });
      this.orgService.getOnboardingDetails(this.sessionToken).subscribe(
        (data: any) => {
          if (data.orgs) {
            this.orgSubject.next(data.orgs);
          }
          if (data.invites) {
            this.inviteSubject.next(data.invites);
          }
          this.loadingDetailsState.next({ type: DataLoadingState.success });
        },
        () => {
          this.loadingDetailsState.next({ type: DataLoadingState.error, error: new Error() });
        },
      );
    } else {
      this.toast.error('Please login first!');
      this.router.navigate(['/auth', 'login']);
    }
  }

  loginToOrg(orgId: string) {
    window.location.href = `https://${environment.auth.domain}/continue?state=${this.state}&orgId=${orgId}`;
  }

  private get sessionToken() {
    return this.activatedRoute.snapshot.queryParams['session_token'];
  }
  private get state() {
    return this.activatedRoute.snapshot.queryParams['state'];
  }
}
