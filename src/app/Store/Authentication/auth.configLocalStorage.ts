import { LocalStorageConfig, localStorageSync } from 'ngrx-store-localstorage';

export function localStorageSyncConfig(): LocalStorageConfig {
    return {
      keys: ['auth'],
      rehydrate: true,
      checkStorageAvailability: true,
      storageKeySerializer: (key) => {
        return key;
      }
    };
  }

  export function localStorageSyncReducer(reducer: any): any {
    return (state:any, action:any) => {
      const syncedState = localStorageSync(localStorageSyncConfig())(reducer)(state, action);
      return syncedState;
    };
  }