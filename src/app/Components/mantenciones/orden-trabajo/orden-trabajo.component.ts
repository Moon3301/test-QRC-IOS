import { Component, OnInit, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MantencionesService } from 'src/app/Services/mantenciones/mantenciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MaintenanceStatusOption } from 'src/app/Interfaces/maintenance';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

import { ToastSonnerComponent } from '../../toast-sonner/toast-sonner.component';

export type ordenTrabajo = {

  descripcion: string;
  ubicacion: string;
  tecnicoAsignado: string;
  fechaProgramada: string;
  serie: string;
  orden: string;
  estado: string;
  data: {name: string, check: boolean}[];

}

interface GroupedMeasurement {
  measurementId: number;
  measurementDescr: string;
  parts: {
      measurementPartId: number;
      measurementPartDescr: string;
      measurementValue: number | null;
      
      steps: {
          measurementStepId: number;
          measurementStepDescr: string;
          measurementValue: number | null;
          id:number;
      }[];
  }[];
}



interface MeasurementPartGroup {
  measurementPartId: number;
  measurementPartDescr: string;
  details: {
    measurementStepId: number;
    measurementStepDescr: string;
    measurementValue: number | null;
    id: number;
  }[];
}

interface MeasurementData {
  descr: string | null;
  associated: boolean;
  maintenanceId: number;
  measurementId: number;
  measurementDescr: string;
  measurementPartId: number;
  measurementPartDescr: string;
  measurementStepId: number;
  measurementStepDescr: string;
  measurementValue: number | null;
  steps: any[];
  parts: any[];
  id: number;
}

@Component({
  standalone: true,
  selector: 'app-orden-trabajo',
  templateUrl: './orden-trabajo.component.html',
  styleUrls: ['./orden-trabajo.component.scss'],
  imports: [MatCardModule, MatCheckboxModule, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, ToastSonnerComponent
  ]
})
export class OrdenTrabajoComponent  implements OnInit {
  
  @ViewChild(ToastSonnerComponent)
  toast_sonner!: ToastSonnerComponent;
  
  dataSourceWorkOrder:any
  dataSourceMeasurement:any
  MaintenanceStatusOption = MaintenanceStatusOption
  allChecked: boolean = false;

  selectedImages: string[] = []; // Lista de URLs de imágenes seleccionadas
  platform: Platform;

  constructor(private mantencionesService: MantencionesService, private route: ActivatedRoute, 
    private router:Router, private platformService: Platform) {
      this.platform = this.platformService;
    }

  async ngOnInit() {

    const params = await firstValueFrom(this.route.paramMap);
    const maintenanceId = params.get('id_main');

    if (maintenanceId) {
      console.log(maintenanceId)
      const parseMaintenanceId = parseInt(maintenanceId);

      const response = await this.mantencionesService.workMaintenances(parseMaintenanceId);
      this.dataSourceWorkOrder = response.data

      if(response.data.measurement){

        const dataMeasurement: MeasurementData[] = response.data?.measurement;

        //const groupedAndSortedData = this.groupAndSortByMeasurementId(dataMeasurement);
        const groupedAndSortedData1 = this.mapData(dataMeasurement)
        const groupedAndSortedData = this.groupAndSortByMeasurementId(groupedAndSortedData1);
        console.log(groupedAndSortedData);
        this.dataSourceMeasurement = groupedAndSortedData

      }
      
    }

    console.log(this.dataSourceWorkOrder)

  }

  async workMaintenance(id: number){

    const response = await this.mantencionesService.workMaintenances(id);
    console.log(response)

  }

  mapOption(id: number, options: { id: number, name: string }[]): string {
    const option = options.find(opt => opt.id === id);
    return option ? option.name : 'No definido';
  }

  async checkAllOptions(event: MatCheckboxChange) {
    this.allChecked = event.checked;
    for (let i of this.dataSourceWorkOrder.labor) {
      i.finished = this.allChecked;
    }

    await this.updateMaintenanceLabor();
  }

  mapData(objects:any) {
    return objects.map((obj: { measurementPartId: any; measurementPartDescr: any; measurementValue: any; measurementStepId: any; measurementStepDescr: any; }) => ({
        ...obj,
        parts: [{
            measurementPartId: obj.measurementPartId,
            measurementPartDescr: obj.measurementPartDescr,
            measurementValue: obj.measurementValue
        }],
        steps: [{
            measurementStepId: obj.measurementStepId,
            measurementStepDescr: obj.measurementStepDescr,
            measurementValue: obj.measurementValue
        }]
    }));
  }

  groupAndSortByMeasurementId(data: MeasurementData[]): GroupedMeasurement[] {
    const groupedMeasurements: { [key: number]: GroupedMeasurement } = {};

    data.forEach(item => {
        const { measurementId, measurementDescr, id } = item;

        // Si el measurementId aún no existe en el objeto agrupado, lo inicializamos
        if (!groupedMeasurements[measurementId]) {
            groupedMeasurements[measurementId] = {
                measurementId,
                measurementDescr,
                parts: []
                
            };
        }

        // Encontrar o crear el part correspondiente
        let part = groupedMeasurements[measurementId].parts.find(p => p.measurementPartId === item.measurementPartId);
        if (!part) {
            part = {
                measurementPartId: item.measurementPartId,
                measurementPartDescr: item.measurementPartDescr,
                measurementValue: item.measurementValue,
                steps: [],
                
            };
            groupedMeasurements[measurementId].parts.push(part);
        }

        // Agregar el step correspondiente al part
        if (!part.steps.some(step => step.measurementStepId === item.measurementStepId)) {
            part.steps.push({
                measurementStepId: item.measurementStepId,
                measurementStepDescr: item.measurementStepDescr,
                measurementValue: item.measurementValue,
                id: item.id
            });
        }
    });

    // Convertir el objeto en un array y ordenar los datos relacionados
    return Object.values(groupedMeasurements).map(group => ({
        ...group,
        parts: group.parts.map(part => ({
            ...part,
            steps: part.steps.sort((a, b) => a.measurementStepId - b.measurementStepId) // Ordenar por measurementStepId
        })).sort((a, b) => a.measurementPartId - b.measurementPartId) // Ordenar por measurementPartId
    }));
  }

  async updateMeasurement(){

    try{
      
      for(let item of this.dataSourceMeasurement){

        for(let part of item.parts){
          
          for(let step of part.steps){
  
            const id = step.id
            let measurementValue = step.measurementValue
  
            if(measurementValue == null){
              measurementValue = 0
            }
            console.log('id: ',step.id)
            console.log('measurementValue: ',step.measurementValue)
  
            const response = await this.mantencionesService.updateMaintenanceMeasurement(id, measurementValue);
            console.log(response)
          }
  
        }
      
      }

    }catch(error){
      console.log(error)
    }
    
  }

  // Método que se llama al cambiar un checkbox
  async onChangeLabor() {

    this.toast_sonner.PromiseToast(
      'Actualizando registro ...',
      'Registro actualizado', 
      'Error al cargar documento', 
      this.updateMaintenanceLabor()
    )

    await this.updateMaintenanceLabor();
  }

  async onChangeMeasurement(){

    this.toast_sonner.PromiseToast(
      'Actualizando registro ...',
      'Registro actualizado', 
      'Error al cargar documento', 
      this.updateMeasurement()
    )

    await this.updateMeasurement();
  }

  async onChangeObservation(){

    this.toast_sonner.PromiseToast(
      'Actualizando registro ...',
      'Registro actualizado', 
      'Error al cargar documento', 
      this.updateMaintenanceObservation()
    )

    await this.updateMaintenanceObservation();
  }

  async onChangeVisiblePDF(){

    this.toast_sonner.PromiseToast(
      'Actualizando registro ...',
      'Registro actualizado', 
      'Error al cargar documento', 
      this.updateMaintenanceVisiblePDF()
    )

    await this.updateMaintenanceVisiblePDF();
  }

  async onChangeImages(){

    this.toast_sonner.PromiseToast(
      'Actualizando registro ...',
      'Registro actualizado', 
      'Error al cargar documento', 
      this.updateMaintenanceImages()
    )

    await this.updateMaintenanceImages();
  }


  async saveWorkOrder(){

    await this.updateMaintenanceLabor();
    await this.updateMeasurement();
    await this.updateMaintenanceObservation();
    await this.updateMaintenanceVisiblePDF();
    await this.updateMaintenanceImages();

    this.toast_sonner.PromiseToast(
      'Guardando registro ...',
      'Mantencion finalizada!', 
      'Error al finalizar mantencion', 
      this.finishWorkOrder()
    )
    
    await this.finishWorkOrder();

    this.router.navigate(['/mantenciones'])
  }

  async updateMaintenanceLabor(){

    try{

      const maintenanceid = this.dataSourceWorkOrder?.id

      for(let item of this.dataSourceWorkOrder?.labor){

        const id = item.id
        const finished = item.finished

        console.log(id, maintenanceid, finished)
        const response = await this.mantencionesService.updateMaintenanceLabor(id ,maintenanceid ,finished)
        console.log(response)
      }

    }catch(error){
      console.log(error)
    }
    

  }

  async updateMaintenanceObservation(){

    try{

      const id = this.dataSourceWorkOrder.maintenance.id
      const observation = this.dataSourceWorkOrder.maintenance.observation

      const response = await this.mantencionesService.updateMaintenanceObservation(id, observation);
      console.log(response)

    }catch(error){
      console.log(error)
    }
    

  }
  
  async updateMaintenanceVisiblePDF(){

    try{

      const id = this.dataSourceWorkOrder.maintenance.id
      const visiblePDF = this.dataSourceWorkOrder?.maintenance.observationVisibleInPdf

      const response = await this.mantencionesService.updateMaintenanceVisibleInPDF(id, visiblePDF);
      console.log(response)

    }catch(error){
      console.log(error)
    }
    
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,  // Puedes usar base64 si prefieres el dato como string
      source: CameraSource.Photos // O CameraSource.Camera si quieres tomar una foto
    });

    if (image) {
      // Agrega la URL temporal de la imagen a la lista
      this.selectedImages.push(image.webPath!); 

      // Si deseas almacenar las imágenes en el dispositivo, puedes usar Filesystem
      if (this.platform.is('hybrid')) {
        const savedFile = await this.saveImage(image);
        console.log('Imagen guardada en el dispositivo:', savedFile);

        await this.updateMaintenanceImages();
      }
    }

    console.log(this.selectedImages)
  }

  async saveImage(photo: any) {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = await this.convertBlobToBase64(blob) as string;

    const fileName = new Date().getTime() + '.jpeg';

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    return savedFile;
  }

  // Convertir Blob a Base64
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  async updateMaintenanceImages(){

    try{
      const id = this.dataSourceWorkOrder.maintenance.id
    
      if(this.selectedImages.length > 0){

        for(let item of this.selectedImages){
          const response = await this.mantencionesService.updateMaintenanceImages(id, item);
          console.log(response)
        }
        
      }else{
        console.log('No existen imagenes para subir')
      }
    }catch(error){
      console.log(error);
    }

  }

  async finishWorkOrder(){

    try{

      const id = this.dataSourceWorkOrder.maintenance.id
      const equipmentId = this.dataSourceWorkOrder.maintenance.equipmentId

      const response = await this.mantencionesService.updateMaintenanceFinish(id, equipmentId);
      console.log(response)

    }catch(error){
      console.log(error);
    }

  }
  
}
