import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { FormioAppConfig } from '@formio/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: FormioAppConfig,
      useValue: {
        appUrl: 'https://sxgdwjdmxjfksmb.form.io',
        apiUrl: 'https://api.form.io'
      }
    }
  ]
};