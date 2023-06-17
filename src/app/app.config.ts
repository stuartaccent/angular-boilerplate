import { HTTP_INTERCEPTORS, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { environment } from '@environments/environment';
import { GlobalHttpInterceptor } from '@modules/shared/interceptors/global-http.interceptor';
import { LocalStorageKeys, LocalStorageService } from '@modules/shared/services/local-storage.service';
import * as Sentry from '@sentry/angular-ivy';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { routes } from './app.routes';

if (environment.sentryDsn) {
  Sentry.init({ dsn: environment.sentryDsn });
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApolloModule),
    importProvidersFrom(HttpClientModule),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptor, multi: true,
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        const http = httpLink.create({ uri: environment.graphHost });
        const storageService = new LocalStorageService();
        const middleware = new ApolloLink((operation, forward) => {
          operation.setContext({
            headers: new HttpHeaders().set(
              'Authorization',
              `Bearer ${storageService.get(LocalStorageKeys.TOKEN)}`,
            ),
          });
          return forward(operation);
        });
        const link = middleware.concat(http);
        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
    (environment.sentryDsn) ? {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({ showDialog: true }),
    } : {
      provide: ErrorHandler,
      useClass: ErrorHandler,
    }
  ]
};
