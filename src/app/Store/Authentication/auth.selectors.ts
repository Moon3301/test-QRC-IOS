import { createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = (state: { auth: AuthState }) => state.auth;

export const selectToken = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.value
);

export const selectUser = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.user
);
