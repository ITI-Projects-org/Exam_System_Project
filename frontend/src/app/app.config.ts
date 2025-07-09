import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
<<<<<<< HEAD
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
=======
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
>>>>>>> 14e87fe710e673150bd507328dc3ab91c33e0cf8
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
<<<<<<< HEAD
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(),
  ]

=======
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
  ],
>>>>>>> 14e87fe710e673150bd507328dc3ab91c33e0cf8
};
