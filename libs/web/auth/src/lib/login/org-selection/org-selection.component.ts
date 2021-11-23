import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DataLoading, DataLoadingState } from '@compito/api-interfaces';
import { ToastService } from '@compito/web/ui';
import { ENV_TOKEN } from '@compito/web/ui/tokens';
import { BehaviorSubject, map, Observable } from 'rxjs';
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
        @media screen and (min-width: 1024px) {
          grid-template-columns: 3fr 5fr;
        }
      }
      .orgs {
        &__list {
          @apply pt-8;
          @apply grid gap-4;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      }
      .invites {
        &__list {
          @apply pt-8;
          @apply grid gap-4;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

  userEmail$: Observable<string | null> = this.auth.user$.pipe(map((user) => user?.email ?? null));
  constructor(
    private orgService: OrgSelectionService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router,
    @Inject(ENV_TOKEN) private environment: any,
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
        (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 400) {
              this.toast.error(err.error?.message);
              this.router.navigate(['/auth', 'login']);
            }
          }
          this.loadingDetailsState.next({ type: DataLoadingState.error, error: new Error() });
        },
      );
    } else {
      this.toast.error('Please login first!');
      this.router.navigate(['/auth', 'login']);
    }
  }

  loginToOrg(orgId: string) {
    window.location.href = `https://${this.environment.auth.domain}/continue?state=${this.state}&orgId=${orgId}`;
  }

  handleInvite(type: 'accept' | 'reject', id: string, orgId: string) {
    switch (type) {
      case 'accept':
        this.orgService.accept(id, this.sessionToken).subscribe(() => {
          this.loginToOrg(orgId);
        });
        break;
      case 'reject':
        this.orgService.reject(id, this.sessionToken).subscribe(() => {
          const existingOrgs = this.orgSubject.value;
          this.orgSubject.next(existingOrgs.filter(({ id: orgId }) => orgId !== id));
        });
        break;

      default:
        break;
    }
  }

  private get sessionToken() {
    return this.activatedRoute.snapshot.queryParams['session_token'];
  }
  private get state() {
    return this.activatedRoute.snapshot.queryParams['state'];
  }
}
