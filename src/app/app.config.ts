import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideRouter(routes), 
    provideHttpClient()],
};
//removido provideZonelessChangeDetection({eventCoalescing: true}), por problemas en console, error NG0908: In this configuration Angular requires Zone.js