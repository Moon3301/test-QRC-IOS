import { createAction, props } from '@ngrx/store';
import { User, UserCredential } from 'src/app/Interfaces/usuario';

export const setToken = createAction(
  '[Auth] Set Token',
  props<{ token: string }>()
);

export const clearToken = createAction(
  '[Auth] Clear Token');

export const setUser = createAction(
  '[Auth] Set User',
  props<{ user: UserCredential }>()
);

export const clearUser = createAction(
  '[Auth] Clear User');

