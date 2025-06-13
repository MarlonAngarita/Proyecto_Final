import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import 'zone.js';
// import { importProvidersFrom } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { routes } from './app/app.routes';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [provideRouter(routes),
  provideHttpClient(withFetch()), /*importProvidersFrom(FormsModule)*/
  ],
}).catch((err) => console.error(err));
