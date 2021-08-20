import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../components';
import { ENV_TOKEN } from '../tokens';

@Injectable()
export class TokenValidatorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toast: ToastService,
    private auth: AuthService,
    @Inject(ENV_TOKEN) private env: any,
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error?.status === 401) {
          this.auth.logout({
            returnTo: `${this.env.baseURL}/auth/login?code=INVALID_SESSION`,
          });
        }
        return throwError(error);
      }),
    );
  }
}
