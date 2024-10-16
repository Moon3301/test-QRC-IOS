import { createReducer, on } from '@ngrx/store';
import { setToken, clearToken, setUser, clearUser } from './auth.actions';
import { Position, Role } from 'src/app/Interfaces/usuario';

export interface AuthState {
  
  login_provider: string;
  name: string;
  user: {
    id?: string;
    token: string;
    name: string;
    userName: string;
    position: number;
    email: string;
    password?: string;
    roles?: Role[]
  };
  value: string | null;
}

export const initialState: AuthState = {
  login_provider: '',
  name: '',
  user: {
    id: '',
    token: '',
    name: '',
    userName: '',
    position: 0,
    email: '',
    password: ''
  },
  value: null,
};

export const authReducer = createReducer(
  initialState,
  on(setToken, (state, { token }) => {
    
    return {
      ...state,
      value: token,
    };
  }),
  on(clearToken, (state) => ({
    ...state,
    value: null,
  })),

  on(setUser, (state, { user }) => {

    return {
      ... state,
      user: user
    }

  }),
  
  
);

