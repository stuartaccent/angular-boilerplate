import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { environment } from '@environments/environment';
import { GlobalHttpInterceptor } from '@modules/shared/interceptors/global-http.interceptor';
import * as Sentry from '@sentry/angular-ivy';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

if (environment.sentryDsn) {
  Sentry.init({ dsn: environment.sentryDsn });
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(routes, withComponentInputBinding()),
    {
        provide: HTTP_INTERCEPTORS,
        useClass: GlobalHttpInterceptor, multi: true,
    },
    (environment.sentryDsn) ? {
        provide: ErrorHandler,
        useValue: Sentry.createErrorHandler({ showDialog: true }),
    } : {
        provide: ErrorHandler,
        useClass: ErrorHandler,
    },
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
};
