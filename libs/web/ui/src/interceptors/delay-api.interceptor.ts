import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ENV_TOKEN } from '../tokens';

@Injectable()
export class DelayInterceptor implements HttpInterceptor {
  constructor(@Inject(ENV_TOKEN) private environment: any) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.environment.production) {
      return next.handle(request);
    }
    const delayInMS = localStorage.getItem('delay');
    return next.handle(request).pipe(delay(delayInMS ? +delayInMS : 0));
  }
}
