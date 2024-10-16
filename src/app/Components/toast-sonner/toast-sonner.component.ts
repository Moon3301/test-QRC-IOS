import { Component, OnInit } from '@angular/core';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-toast-sonner',
  templateUrl: './toast-sonner.component.html',
  styleUrls: ['./toast-sonner.component.scss'],
  imports: [NgxSonnerToaster]
})
export class ToastSonnerComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  SuccessToast(message:string) {
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

  PromiseToast(loadingMessage: string, successMessage: string, errorMessage: string, promise: Promise<any>){

    toast.promise(promise, {

      loading: loadingMessage,
      success: () =>{
        return successMessage
      },
      error: errorMessage

    })

    

  }

}
