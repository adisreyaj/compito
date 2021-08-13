import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { API_TOKEN } from '@compito/web/ui';
import { UsersState } from '@compito/web/users';
import { DialogModule } from '@ngneat/dialog';
import { popperVariation, TippyModule, tooltipVariation } from '@ngneat/helipopper';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { enableMapSet } from 'immer';
import { IconModule } from '../../../../libs/web/ui/src/lib/icon/icon.module';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
enableMapSet();
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: environment.auth.domain,
      audience: environment.auth.audience,
      clientId: environment.auth.clientId,
      redirectUri: window.location.origin,
      httpInterceptor: {
        allowedList: ['http://localhost:3333/api/*'],
      },
    }),
    DialogModule.forRoot(),
    HotToastModule.forRoot(),
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
        menu: {
          ...popperVariation,
          role: 'dropdown',
          arrow: false,
          hideOnClick: true,
          zIndex: 99,
        },
      },
    }),
    IconModule,
    NgxsModule.forRoot([UsersState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: API_TOKEN,
      useValue: environment.api,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
