import { enableProdMode, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideState, provideStore, MetaReducer } from '@ngrx/store';
//import { Storage } from '@ionic/storage-angular';
import { authReducer } from './app/Store/Authentication/auth.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { localStorageSyncReducer } from './app/Store/Authentication/auth.configLocalStorage';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
// Define los metaReducers
export const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    //Storage,
    // Aplica los metaReducers en provideStore
    provideStore({
      auth: authReducer
    }, { metaReducers }),
    
    provideStoreDevtools({
      maxAge: 25, // Retiene los últimos 25 estados
      logOnly: !isDevMode(), // Restringe la extensión al modo de solo registro
      autoPause: true, // Pausa la grabación de acciones y cambios de estado cuando la ventana de la extensión no está abierta
      trace: false, // Si se establece en true, incluirá la traza de pila para cada acción despachada
      traceLimit: 75, // Máximo de frames de traza de pila a almacenar (en caso de que se proporcione la opción trace como true)
    }), provideCharts(withDefaultRegisterables()),
  ],
}).catch(err => console.error(err));


