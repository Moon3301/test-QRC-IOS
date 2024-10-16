import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { IonicModule } from '@ionic/angular';
import { EquipmentService } from 'src/app/Services/equipment/equipment.service';

import { ActivatedRoute, Router } from '@angular/router';
import { EquipmentPagination, } from 'src/app/Interfaces/equipment';
import {PageEvent} from '@angular/material/paginator';
import { DocumentsService } from 'src/app/Services/documents/documents.service';
import { firstValueFrom } from 'rxjs';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { ToastSonnerComponent } from '../../toast-sonner/toast-sonner.component';

import {
  FileSharer
} from '@byteowls/capacitor-filesharer';

@Component({
  standalone: true,
  selector: 'app-history-equipment',
  templateUrl: './history-equipment.component.html',
  styleUrls: ['./history-equipment.component.scss'],
  imports: [IonicModule, CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, 
  MatCardModule, ToastSonnerComponent]
})
export class HistoryEquipmentComponent  implements OnInit {

  @ViewChild(ToastSonnerComponent)
  toast_sonner!: ToastSonnerComponent;
  
  dataSource:any
  equipmentId:any

  constructor(private route: ActivatedRoute, private equipmentService: EquipmentService, private router:Router,
    private documentsService:DocumentsService, private platform: Platform) { }

  async ngOnInit() {
    try {
      const params = await firstValueFrom(this.route.paramMap);
      const equipmentId = params.get('id');
      
      if (equipmentId) {

        this.equipmentId = equipmentId

        console.log(equipmentId);
        const response = await this.historyEquipment(equipmentId);
        this.dataSource = response?.data; 
        console.log(this.dataSource);
      } else {
        console.error('No se encontró el equipmentId');
      }
    } catch (error) {
      console.error('Error al obtener el equipmentId o los datos:', error);
    }
  }

  async historyEquipment(_id: any, pageEvent?: PageEvent):Promise<any>{

    const pagination: EquipmentPagination = {
      Entity: '',
      PageIndex: pageEvent ? pageEvent.pageIndex + 1 : 1,
      PageSize: pageEvent ? pageEvent.pageSize : 10,
      PageCount: 0,
      RecordCount: 0,
      SortColumn: '',
      SortOrder: 'ASC'
    }

    const id = parseInt(_id);

    const response = await this.equipmentService.historyEquipment(id, pagination);
    console.log(response)
    return response

  }

  navigateToWorkOrder(id:number){
    this.router.navigate([`/orden-trabajo/${id}`]);
  }

  async printHistory(){
    
    try{

      this.toast_sonner.PromiseToast(
        'Cargando PDF ...',
        'PDF guardado en dispositivo local', 
        'Error al descargar PDF', 
        this.documentsService.historyDocuments(this.equipmentId, '')
      )

      const response = await this.documentsService.historyDocuments(this.equipmentId, '');
      console.log(response)

      const responseBlob = response.data

      const timestamp = new Date().getTime();

      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        // Si es un dispositivo móvil, guardar en el sistema de archivos

        await this.saveAndSharePDF(responseBlob, `Serial_${this.dataSource.equipment.serial}_${timestamp}`);
        
      } else {

        // Si es un navegador, descargar el archivo
        const url = window.URL.createObjectURL(responseBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Serial_${this.dataSource.equipment.serial}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

      }

    }catch(error){
      console.log(error)
    }
    
  }

  async saveFileToDevice(blob: Blob, filename: string) {
    try {
      // Convertir el Blob en base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {

        if(reader.result){

          const base64Data = reader.result.toString().split(',')[1];
  
          // Guardar el archivo en el directorio del sistema
          const result = await Filesystem.writeFile({
            path: `${filename}.pdf`,
            data: base64Data,
            directory: Directory.Documents, // Puedes cambiar esto a Directory.Data para un directorio accesible
          });
    
          console.log('Archivo guardado en:', result.uri);

        }
        
      };
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
    }
  }

  async saveAndSharePDF(blob: Blob, filename: string) {
    try {
      // Convertir el Blob en base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        if (reader.result) {
          const base64Data = reader.result.toString().split(',')[1];
  
          // Guardar el archivo en el directorio de Descargas (Downloads)
          const result = await Filesystem.writeFile({
            path: `${filename}.pdf`,
            data: base64Data,
            directory: Directory.Documents, // Guardar en la carpeta Descargas
          });
  
          console.log('Archivo guardado en:', result.uri);
  
          // Compartir el archivo
          await FileSharer.share({
            filename: `${filename}.pdf`,
            base64Data: base64Data,
            contentType: 'application/pdf',
          });
        }
      };
    } catch (error) {
      console.error('Error al guardar o compartir el archivo:', error);
    }
  }

  async printMaintenance(maintenanceId: number) {
    try {

      this.toast_sonner.PromiseToast(
        'Cargando PDF ...',
        'PDF guardado en dispositivo local', 
        'Error al descargar PDF', 
        this.documentsService.printReports(maintenanceId, '')
      )

      const response = await this.documentsService.printReports(maintenanceId, '');

      const responseBlob = response.data

      const timestamp = new Date().getTime();
  
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        // Si es un dispositivo móvil, guardar en el sistema de archivos
        await this.saveAndSharePDF(responseBlob, `maintenance_report_${maintenanceId}_${timestamp}`);
      } else {
        // Si es un navegador, descargar el archivo
        const url = window.URL.createObjectURL(responseBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `maintenance_report_${maintenanceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
  
    } catch (error) {
      console.error('Error descargando o guardando el archivo:', error);
    }
  }

}
