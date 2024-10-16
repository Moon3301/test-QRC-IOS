import { Component, OnInit } from '@angular/core';
import { QrScannerService } from 'src/app/Services/QR-Scanner/qr-scanner.service';
import { IonContent, IonButton, IonHeader, IonToolbar } from "@ionic/angular/standalone";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MantencionesService } from 'src/app/Services/mantenciones/mantenciones.service';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-scanner-qr',
  templateUrl: './scanner-qr.component.html',
  styleUrls: ['./scanner-qr.component.scss'],
  imports: [IonToolbar, IonHeader, IonButton, IonContent, MatButtonModule, MatCardModule]
})
export class ScannerQRComponent  implements OnInit {

  constructor(private qrScannerService:QrScannerService, private maintenanceService:MantencionesService,
    private router: Router,
  ) { }

  ngOnInit() {}

  // Llama al servicio para iniciar el escaneo con la cámara
  async onStartScan() {
    try{

      console.log('Iniciando escaneo a traves de camara')
      const result = await this.qrScannerService.startCameraScan();
      
      console.log('Obteniendo ID de mantencion')
      console.log('Realizando solicitud para obtener OT')
      const response = await this.getMaintenanceWorkQR(result);

      if(response.status == 200){
        console.log('OT: ', response)
        this.navigateToOrdenTrabajo(result)
      }

    }catch(error){
      console.log(error)
    }
    
  }

  // Llama al servicio para escanear un código QR desde una imagen
  async onScanFromImage() {

    try{
      console.log('Iniciando escaneo a traves de imagenes')
      const result = await this.qrScannerService.scanFromImageV2();
      
      console.log('Obteniendo ID de mantencion')
      console.log('Realizando solicitud para obtener OT')
      const response = await this.getMaintenanceWorkQR(result)

      if(response.status == 200){
        console.log('OT: ', response)
        this.navigateToOrdenTrabajo(result)
      }

    }catch(error){
      console.log(error)
    }
    
  }

  async getMaintenanceWorkQR(id: number){

    const response = await this.maintenanceService.workQRMaintenance(id);
    console.log(response);
    return response
  }

  navigateToOrdenTrabajo(id:number){
    this.router.navigate([`/orden-trabajo/${id}`])
  }

}
