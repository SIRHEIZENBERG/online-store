import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideAnimations } from '@angular/platform-browser/animations';
// import { provideMatDialog } from '@angular/material/dialog';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { environment } from './Environment/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // ✅ REQUIRED FOR MATDIALOG
    provideAnimations(),
    // provideMatDialog(),

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
