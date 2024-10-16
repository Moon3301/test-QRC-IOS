import { Injectable, inject } from '@angular/core';
import { UsuariosService } from '../usuarios/usuarios.service';
import { User, UserCredential } from 'src/app/Interfaces/usuario';
import { UserToken } from 'src/app/Interfaces/usuario';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiService } from '../api/api.service';

import { api_url } from '../utilities';

import { Store, select } from '@ngrx/store';

import { selectToken, selectUser } from 'src/app/Store/Authentication/auth.selectors';
import { AuthState } from 'src/app/Store/Authentication/auth.reducer';
import { setToken, clearToken, setUser } from 'src/app/Store/Authentication/auth.actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SecurityService {

  currentUser:UserCredential | null = null
  user$!: Observable<UserCredential | null>;

  currentToken:string | null = null;
  token$!: Observable<string | null>;

  constructor(private api:ApiService, private store: Store<{ auth: AuthState }>, private router: Router) {}

  async activeUser(): Promise<Boolean>{

    await this.loadToken();

    const token = this.currentToken;

    if(token != null){

      return true
      
    }else{

      return false
    }

  }

  setUserToken(token:string) {       
    this.store.dispatch(setToken({ token }));
  }

  clearToken() {
    this.store.dispatch(clearToken());
  }

  setUser(user:UserCredential){
    this.store.dispatch(setUser({ user}));
  }
 
  public async loadToken(){
    // Selecciona el token desde el store
    this.token$ = this.store.select(selectToken);
    this.token$.subscribe(token => {
      if (token) {
        this.currentToken = token
      } else {
        console.log('No hay token disponible.');
        this.router.navigate(['/login'])
      }
    });
  }

  public async loadUser(){
    
    this.user$ = this.store.select(selectUser);
    this.user$.subscribe(user => {
      if(user) {
        this.currentUser = user
      } else {
        console.log('No hay usuario disponible')
      }
    });
  }

  async login(username: string, password: string){

    const endpoint = `${api_url}/security/login`
    const method = 'POST'

    const queryParams = {
      "username": username,
      "password": password
    }
    const body = undefined
    const token = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams);

    if(response){

      const userCredential: UserCredential = {
        id: response.data.id,
        token: response.data.token,
        name: response.data.name,
        position: response.data.position,
        userName: response.data.username,
        email: response.data.email,
        password: ''

      }

      const userToken: UserToken = {
        user: userCredential,
        login_provider: 'mobile',
        name: 'token',
        value: response.data.token
      }
      console.log('Guardando token en store')
      //await this.storage.set('UserToken', userToken)
      this.setUserToken(userToken.value);
      this.setUser(userToken.user);
      
    }else{

      console.log('Error al iniciar sesion.')

    }

  }
  
  logout(){
    
    this.clearToken();
    this.currentToken = null
    
  }

}

