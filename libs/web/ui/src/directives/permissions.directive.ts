import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserDetails } from '@compito/api-interfaces';
import { Subscription } from 'rxjs';
import { formatUser } from '../util';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[permission]',
})
export class PermissionsDirective implements OnInit, OnDestroy {
  private loggedInUser!: UserDetails;
  private requiredPermission!: string;

  subscription!: Subscription;

  @Input()
  set permission(permission: string) {
    this.requiredPermission = permission;
    this.updateView();
  }
  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subscription = this.authService.user$.pipe(formatUser()).subscribe((user) => {
      if (user) {
        this.vcr.clear();
        this.loggedInUser = user;
        this.updateView();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateView() {
    if (this.hasPermission()) {
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
    this.cdr.markForCheck();
  }

  private hasPermission() {
    if (!this.loggedInUser) return false;
    const userPermissions = this.loggedInUser.role.permissions;
    if (userPermissions) {
      return userPermissions.includes(this.requiredPermission);
    }
    return false;
  }
}

@NgModule({
  declarations: [PermissionsDirective],
  imports: [CommonModule],
  exports: [PermissionsDirective],
})
export class PermissionsDirectiveModule {}
