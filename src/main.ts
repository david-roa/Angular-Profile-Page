import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/**
 * Verify compatible nav
 */
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker y Push son compatibles');

  navigator.serviceWorker.register('firebase-messaging-sw.js')
  .then(function(swReg) {
    console.log('Service Worker está registrado');
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('La mensajería push no es compatible');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
