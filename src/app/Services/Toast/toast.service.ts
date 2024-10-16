import { Injectable } from '@angular/core';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  constructor(private router:Router) { }

  SuccessToast(message: string){
    toast.success(message);
  }

  InfoToast(message:string){
    toast.info(message);
  }

  ErrorToast(message:string){
    toast.error(message);
  }

  WarningToast(message:string){
    toast.warning(message);
  }

  async LoadingToastLogin(promise: Promise<any>){
    toast.promise(promise, {
      loading: 'Iniciando sesion ...',
      success: 'Inicio de sesion exitoso',
      error: 'Error al iniciar sesion '
    })
  }


}
